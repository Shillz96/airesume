from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv
from models.job import Job, JobCreate, JobResponse
from models.user import User
from auth.dependencies import get_current_user

# Load environment variables
load_dotenv()

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# Adzuna API credentials
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

@router.get("", response_model=List[JobResponse])
async def get_jobs(
    title: Optional[str] = Query(None, description="Job title or keyword"),
    location: Optional[str] = Query(None, description="Location"),
    country: str = Query("us", description="Country code"),
    type: Optional[str] = Query(None, description="Job type"),
    experience: Optional[str] = Query(None, description="Experience level"),
    remote: Optional[str] = Query(None, description="Remote or onsite"),
    salary: Optional[str] = Query(None, description="Salary range"),
    current_user: User = Depends(get_current_user),
):
    """
    Fetch jobs from Adzuna API based on search criteria
    """
    try:
        # Build Adzuna API URL
        url = f"{ADZUNA_BASE_URL}/{country}/search/1"
        
        # Prepare query parameters
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_API_KEY,
            "results_per_page": 20,
            "content-type": "application/json",
        }
        
        # Add search parameters if provided
        if title:
            params["what"] = title
        if location:
            params["where"] = location
        if salary:
            # Parse salary range
            try:
                min_salary, max_salary = salary.split("-")
                params["salary_min"] = min_salary
                params["salary_max"] = max_salary
            except ValueError:
                pass
        
        # Add filters for job type
        if type:
            type_mapping = {
                "full_time": "full_time",
                "part_time": "part_time",
                "contract": "contract",
                "temporary": "temp",
                "internship": "internship"
            }
            if type in type_mapping:
                params["contract_type"] = type_mapping[type]
        
        # Make request to Adzuna API
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, 
                                    detail=f"Error fetching jobs: {data.get('error', 'Unknown error')}")
            
            # Transform Adzuna results to our JobResponse model
            jobs = []
            for result in data.get("results", []):
                # Calculate match percentage based on title and skills (simplified)
                # In a real app, this would compare user skills to job requirements
                match_score = None
                if current_user and current_user.profile:
                    # Simple matching algorithm - would be more sophisticated in production
                    match_score = calculate_match_score(current_user, result)
                
                job_data = {
                    "id": result.get("id", ""),
                    "title": result.get("title", ""),
                    "company": result.get("company", {}).get("display_name", "Unknown Company"),
                    "location": result.get("location", {}).get("display_name", ""),
                    "description": result.get("description", ""),
                    "postedAt": result.get("created", ""),
                    "salary": f"{result.get('salary_min', 'N/A')} - {result.get('salary_max', 'N/A')}",
                    "type": result.get("contract_type", "").replace("_", " ").title(),
                    "isRemote": "remote" in result.get("description", "").lower(),
                    "skills": extract_skills(result.get("description", "")),
                    "match": match_score,
                    "status": "new",
                    "saved": False
                }
                jobs.append(job_data)
            
            return jobs
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching jobs: {str(e)}")

def calculate_match_score(user, job_data):
    """
    Calculate a match score between user and job
    This is a simplified version - a real implementation would be more sophisticated
    """
    score = 0
    max_score = 100
    
    # Check title match
    if user.profile.get("title") and user.profile.get("title").lower() in job_data.get("title", "").lower():
        score += 30
    
    # Check skills match (simplified)
    user_skills = set(user.profile.get("skills", []))
    job_skills = set(extract_skills(job_data.get("description", "")))
    
    if user_skills and job_skills:
        matching_skills = user_skills.intersection(job_skills)
        if matching_skills:
            score += min(50, len(matching_skills) * 10)
    
    # Add randomness for demo purposes
    import random
    score += random.randint(0, 20)
    
    # Cap at 100
    return min(score, max_score)

def extract_skills(description):
    """
    Extract skills from job description
    This is a simplified version - a real implementation would use NLP
    """
    common_skills = [
        "python", "javascript", "java", "c++", "react", "angular", "vue", 
        "node.js", "express", "django", "flask", "spring", "aws", "azure",
        "gcp", "docker", "kubernetes", "sql", "nosql", "mongodb", "postgresql",
        "mysql", "git", "agile", "scrum", "devops", "ci/cd", "machine learning"
    ]
    
    skills = []
    for skill in common_skills:
        if skill.lower() in description.lower():
            skills.append(skill)
    
    return skills[:5]  # Return up to 5 skills 