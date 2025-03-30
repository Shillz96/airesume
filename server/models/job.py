from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    type: Optional[str] = None
    salary: Optional[str] = None
    isRemote: Optional[bool] = False
    postedAt: Optional[str] = None
    
class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str
    skills: List[str] = []
    
    class Config:
        orm_mode = True

class JobResponse(Job):
    match: Optional[int] = None
    status: Optional[str] = "new"
    saved: Optional[bool] = False 