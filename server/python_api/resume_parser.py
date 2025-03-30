import os
import json
import tempfile
import uuid
from typing import Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

# Set up upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ResumeParser:
    """Utility for parsing and processing uploaded resume files"""
    
    @staticmethod
    def save_uploaded_file(file_content: bytes, original_filename: str) -> Tuple[str, str]:
        """
        Save an uploaded file to disk
        
        Args:
            file_content: Binary content of the file
            original_filename: Original filename
            
        Returns:
            Tuple of (file_path, unique_filename)
        """
        # Create a unique filename to prevent collisions
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save the file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return file_path, unique_filename
    
    @staticmethod
    def parse_resume(file_path: str, file_type: str) -> Optional[Dict[str, Any]]:
        """
        Parse a resume file to extract structured data
        
        Args:
            file_path: Path to the resume file
            file_type: MIME type of the file
            
        Returns:
            Dictionary of parsed data or None if parsing failed
        """
        try:
            # This is a simplified implementation
            # In a real-world scenario, you would use specialized libraries
            # like PyPDF2 for PDFs, python-docx for Word docs, etc.
            
            # Example structure for the parsed data
            parsed_data = {
                "personal_info": {
                    "name": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                    "website": "",
                    "linkedin": ""
                },
                "summary": "",
                "education": [],
                "experience": [],
                "skills": [],
                "certifications": [],
                "languages": [],
                "projects": []
            }
            
            # Here you would add code to extract text from different file types
            # and then use NLP/ML techniques to identify and categorize sections
            
            # For now, we'll just return an empty structure
            return parsed_data
            
        except Exception as e:
            logger.error(f"Error parsing resume: {str(e)}")
            return None
    
    @staticmethod
    def convert_to_resume_content(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert parsed resume data to the format expected by the Resume model
        
        Args:
            parsed_data: The parsed resume data
            
        Returns:
            Content object for the Resume model
        """
        return {
            "personalInfo": {
                "name": parsed_data.get("personal_info", {}).get("name", ""),
                "email": parsed_data.get("personal_info", {}).get("email", ""),
                "phone": parsed_data.get("personal_info", {}).get("phone", ""),
                "location": parsed_data.get("personal_info", {}).get("location", ""),
                "website": parsed_data.get("personal_info", {}).get("website", ""),
                "linkedin": parsed_data.get("personal_info", {}).get("linkedin", "")
            },
            "summary": parsed_data.get("summary", ""),
            "education": [
                {
                    "institution": edu.get("institution", ""),
                    "degree": edu.get("degree", ""),
                    "fieldOfStudy": edu.get("field_of_study", ""),
                    "startDate": edu.get("start_date", ""),
                    "endDate": edu.get("end_date", ""),
                    "gpa": edu.get("gpa", ""),
                    "description": edu.get("description", "")
                }
                for edu in parsed_data.get("education", [])
            ],
            "experience": [
                {
                    "title": exp.get("title", ""),
                    "company": exp.get("company", ""),
                    "location": exp.get("location", ""),
                    "startDate": exp.get("start_date", ""),
                    "endDate": exp.get("end_date", ""),
                    "description": exp.get("description", ""),
                    "highlights": exp.get("highlights", [])
                }
                for exp in parsed_data.get("experience", [])
            ],
            "skills": [
                {
                    "name": skill.get("name", ""),
                    "proficiency": skill.get("proficiency", 3)
                }
                for skill in parsed_data.get("skills", [])
            ],
            "certifications": parsed_data.get("certifications", []),
            "languages": parsed_data.get("languages", []),
            "projects": [
                {
                    "name": proj.get("name", ""),
                    "description": proj.get("description", ""),
                    "url": proj.get("url", ""),
                    "highlights": proj.get("highlights", [])
                }
                for proj in parsed_data.get("projects", [])
            ]
        } 