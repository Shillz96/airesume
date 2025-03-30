import os
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..database import Base, get_db
from ..main import app

# Create an in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables in the test database
Base.metadata.create_all(bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)

def test_read_root(client):
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "AllHire Resume Upload API"}

def test_upload_resume(client, test_upload_dir):
    """Test uploading a resume file"""
    # Create a sample resume file
    test_file_path = os.path.join(os.path.dirname(__file__), "test_resume.txt")
    with open(test_file_path, "w") as f:
        f.write("Test resume content for John Doe\nEmail: john@example.com")
    
    # Test file upload
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/uploads/resume/",
            files={"file": ("test_resume.txt", f, "text/plain")},
            data={"user_id": 1}
        )
    
    # Clean up the test file
    os.remove(test_file_path)
    
    # Check response
    assert response.status_code == status.HTTP_202_ACCEPTED
    data = response.json()
    assert data["user_id"] == 1
    assert data["original_filename"] == "test_resume.txt"
    assert data["status"] == "pending"
    
    # Get the upload ID from the response
    upload_id = data["id"]
    
    # Verify we can retrieve the upload
    response = client.get(f"/uploads/resume/{upload_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == upload_id

def test_user_resumes(client):
    """Test getting all resumes for a user"""
    response = client.get("/resumes/user/1")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_get_nonexistent_resume(client):
    """Test getting a resume that doesn't exist"""
    response = client.get("/resumes/999?user_id=1")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_resume_upload(client, test_upload_dir):
    """Test deleting a resume upload"""
    # First create an upload
    test_file_path = os.path.join(os.path.dirname(__file__), "test_resume.txt")
    with open(test_file_path, "w") as f:
        f.write("Test resume content for deletion")
    
    # Upload the file
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/uploads/resume/",
            files={"file": ("test_resume.txt", f, "text/plain")},
            data={"user_id": 1}
        )
    
    # Clean up the test file
    os.remove(test_file_path)
    
    # Get the upload ID
    upload_id = response.json()["id"]
    
    # Now delete the upload
    response = client.delete(f"/uploads/resume/{upload_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify it's gone
    response = client.get(f"/uploads/resume/{upload_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND 