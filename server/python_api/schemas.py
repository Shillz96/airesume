from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime

# Resume Upload Schemas
class ResumeUploadBase(BaseModel):
    user_id: int

class ResumeUploadCreate(ResumeUploadBase):
    original_filename: str
    file_type: str
    file_size: int
    
class ResumeUploadUpdate(BaseModel):
    status: Optional[str] = None
    resume_id: Optional[int] = None
    parsed_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class ResumeUploadResponse(ResumeUploadBase):
    id: int
    original_filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    status: str
    resume_id: Optional[int] = None
    parsed_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    
    class Config:
        orm_mode = True

# Resume Schemas
class ResumeBase(BaseModel):
    title: str
    template: str = "professional"
    content: Dict[str, Any]

class ResumeCreate(ResumeBase):
    user_id: int
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    
    class Config:
        orm_mode = True

# User Schemas (simplified for authentication)
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    is_admin: bool = False

class UserResponse(UserBase):
    id: int
    is_admin: bool
    
    class Config:
        orm_mode = True

# Token schema for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

# Job Schemas
class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    type: Optional[str] = None
    salary: Optional[str] = None
    isRemote: Optional[bool] = False
    postedAt: Optional[str] = None
    skills: List[str] = []
    match: Optional[int] = None
    status: Optional[str] = "new"
    saved: Optional[bool] = False
    
    class Config:
        orm_mode = True 