from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Dict, Any
import os
from . import models, schemas

# Resume Upload CRUD operations
def create_resume_upload(db: Session, upload: schemas.ResumeUploadCreate, file_path: str) -> models.ResumeUpload:
    """Create a new resume upload record"""
    db_upload = models.ResumeUpload(
        user_id=upload.user_id,
        file_path=file_path,
        original_filename=upload.original_filename,
        file_type=upload.file_type,
        file_size=upload.file_size,
        status="pending"
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload

def get_resume_upload(db: Session, upload_id: int) -> Optional[models.ResumeUpload]:
    """Get a specific resume upload by ID"""
    return db.query(models.ResumeUpload).filter(models.ResumeUpload.id == upload_id).first()

def get_resume_uploads_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.ResumeUpload]:
    """Get all resume uploads for a user"""
    return db.query(models.ResumeUpload).filter(models.ResumeUpload.user_id == user_id).order_by(
        desc(models.ResumeUpload.upload_date)
    ).offset(skip).limit(limit).all()

def update_resume_upload(db: Session, upload_id: int, upload: schemas.ResumeUploadUpdate) -> Optional[models.ResumeUpload]:
    """Update a resume upload record"""
    db_upload = get_resume_upload(db, upload_id)
    if not db_upload:
        return None
    
    update_data = upload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_upload, key, value)
    
    db.commit()
    db.refresh(db_upload)
    return db_upload

def delete_resume_upload(db: Session, upload_id: int) -> bool:
    """Delete a resume upload record and its file"""
    db_upload = get_resume_upload(db, upload_id)
    if not db_upload:
        return False
    
    # Delete the file if it exists
    if os.path.exists(db_upload.file_path):
        try:
            os.remove(db_upload.file_path)
        except Exception:
            pass  # We still want to delete the DB record even if file deletion fails
    
    db.delete(db_upload)
    db.commit()
    return True

# Resume CRUD operations
def create_resume(db: Session, resume: schemas.ResumeCreate) -> models.Resume:
    """Create a new resume"""
    db_resume = models.Resume(**resume.dict())
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def get_resume(db: Session, resume_id: int, user_id: Optional[int] = None) -> Optional[models.Resume]:
    """Get a specific resume by ID, optionally filtering by user_id for security"""
    query = db.query(models.Resume).filter(models.Resume.id == resume_id)
    if user_id is not None:
        query = query.filter(models.Resume.user_id == user_id)
    return query.first()

def get_resumes_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.Resume]:
    """Get all resumes for a user"""
    return db.query(models.Resume).filter(models.Resume.user_id == user_id).order_by(
        desc(models.Resume.updated_at)
    ).offset(skip).limit(limit).all()

def update_resume(db: Session, resume_id: int, user_id: int, resume: schemas.ResumeUpdate) -> Optional[models.Resume]:
    """Update a resume"""
    db_resume = get_resume(db, resume_id, user_id)
    if not db_resume:
        return None
    
    update_data = resume.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_resume, key, value)
    
    db.commit()
    db.refresh(db_resume)
    return db_resume

def delete_resume(db: Session, resume_id: int, user_id: int) -> bool:
    """Delete a resume"""
    db_resume = get_resume(db, resume_id, user_id)
    if not db_resume:
        return False
    
    db.delete(db_resume)
    db.commit()
    return True

# User CRUD operations (simplified)
def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """Get a user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Get a user by username"""
    return db.query(models.User).filter(models.User.username == username).first() 