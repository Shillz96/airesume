import os
import logging
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
from dotenv import load_dotenv
import sqlalchemy

from . import models, schemas, crud
from .database import engine, Base, get_db
from .resume_parser import ResumeParser
from .routes import jobs  # Import the jobs router

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="AllHire Resume Upload API")

# Get CORS settings from environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
environment = os.getenv("ENVIRONMENT", "development")

# Configure CORS - more restrictive in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if environment == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    try:
        # Check if tables exist first
        inspector = sqlalchemy.inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if not existing_tables:
            # Only create tables if none exist
            logger.info("No existing tables found. Creating database tables...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        else:
            logger.info(f"Found existing tables: {', '.join(existing_tables)}")
            
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        # Don't raise the exception - let the app start anyway
        # The migrations should handle table creation

# Include routers
app.include_router(jobs.router)

# Background task to process resume uploads
def process_resume_upload(upload_id: int, db: Session):
    # Get database session for this task
    db_upload = crud.get_resume_upload(db, upload_id)
    if not db_upload:
        logger.error(f"Resume upload {upload_id} not found")
        return
    
    try:
        # Update status to processing
        crud.update_resume_upload(db, upload_id, schemas.ResumeUploadUpdate(status="processing"))
        
        # Parse the resume
        parsed_data = ResumeParser.parse_resume(db_upload.file_path, db_upload.file_type)
        if not parsed_data:
            crud.update_resume_upload(
                db, 
                upload_id, 
                schemas.ResumeUploadUpdate(
                    status="failed",
                    error_message="Failed to parse resume file"
                )
            )
            return
        
        # Convert parsed data to resume content format
        resume_content = ResumeParser.convert_to_resume_content(parsed_data)
        
        # Create a new resume record
        resume = schemas.ResumeCreate(
            user_id=db_upload.user_id,
            title=f"Resume from {db_upload.original_filename}",
            template="professional",
            content=resume_content,
            file_path=db_upload.file_path,
            file_name=db_upload.original_filename,
            file_type=db_upload.file_type,
            file_size=db_upload.file_size
        )
        
        db_resume = crud.create_resume(db, resume)
        
        # Update the upload record with success status and resume_id
        crud.update_resume_upload(
            db,
            upload_id,
            schemas.ResumeUploadUpdate(
                status="completed",
                resume_id=db_resume.id,
                parsed_data=parsed_data
            )
        )
        
        logger.info(f"Successfully processed resume upload {upload_id}")
        
    except Exception as e:
        logger.exception(f"Error processing resume upload {upload_id}: {str(e)}")
        crud.update_resume_upload(
            db,
            upload_id,
            schemas.ResumeUploadUpdate(
                status="failed",
                error_message=str(e)
            )
        )

@app.get("/")
def read_root():
    return {"message": "AllHire Resume Upload API"}

@app.post("/uploads/resume/", response_model=schemas.ResumeUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_resume(
    background_tasks: BackgroundTasks,
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a resume file for processing
    
    The file will be saved and a background task will be started to parse it
    """
    try:
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        
        if file_size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file"
            )
        
        # Save the file
        file_path, _ = ResumeParser.save_uploaded_file(file_content, file.filename)
        
        # Create upload record
        upload = schemas.ResumeUploadCreate(
            user_id=user_id,
            original_filename=file.filename,
            file_type=file.content_type,
            file_size=file_size
        )
        
        db_upload = crud.create_resume_upload(db, upload, file_path)
        
        # Start background processing
        background_tasks.add_task(process_resume_upload, db_upload.id, db)
        
        return db_upload
        
    except Exception as e:
        logger.exception(f"Error uploading resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/uploads/resume/{upload_id}", response_model=schemas.ResumeUploadResponse)
def get_resume_upload(upload_id: int, db: Session = Depends(get_db)):
    """Get details of a resume upload"""
    db_upload = crud.get_resume_upload(db, upload_id)
    if not db_upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume upload not found"
        )
    return db_upload

@app.get("/uploads/resume/user/{user_id}", response_model=List[schemas.ResumeUploadResponse])
def get_user_resume_uploads(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all resume uploads for a user"""
    return crud.get_resume_uploads_by_user(db, user_id, skip, limit)

@app.get("/resumes/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(resume_id: int, user_id: int, db: Session = Depends(get_db)):
    """Get a specific resume"""
    db_resume = crud.get_resume(db, resume_id, user_id)
    if not db_resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return db_resume

@app.get("/resumes/user/{user_id}", response_model=List[schemas.ResumeResponse])
def get_user_resumes(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all resumes for a user"""
    return crud.get_resumes_by_user(db, user_id, skip, limit)

@app.delete("/uploads/resume/{upload_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume_upload(upload_id: int, db: Session = Depends(get_db)):
    """Delete a resume upload"""
    success = crud.delete_resume_upload(db, upload_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume upload not found"
        )

@app.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: int, user_id: int, db: Session = Depends(get_db)):
    """Delete a resume"""
    success = crud.delete_resume(db, resume_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        ) 