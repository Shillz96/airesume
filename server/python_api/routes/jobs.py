from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv
from ..schemas import JobResponse
from ..database import get_db
from sqlalchemy.orm import Session

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
    db: Session = Depends(get_db),
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
                # Calculate match percentage for demo purposes
                import random
                match_score = random.randint(60, 98)
                
                job_data = {
                    "id": result.get("id", ""),
                    "title": result.get("title", ""),
                    "company": result.get("company", {}).get("display_name", "Unknown Company"),
                    "location": result.get("location", {}).get("display_name", ""),
                    "description": result.get("description", ""),
                    "postedAt": result.get("created", ""),
                    "salary": result.get("salary_is_predicted", "Not specified"),
                    "type": result.get("contract_type", "Not specified"),
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