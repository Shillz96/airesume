import os
import pytest
import tempfile
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..database import Base, get_db
from ..main import app
from ..resume_parser import UPLOAD_DIR

# Create a temporary directory for uploads during tests
@pytest.fixture(scope="session")
def test_upload_dir():
    original_upload_dir = UPLOAD_DIR
    
    # Create a temporary directory for test uploads
    with tempfile.TemporaryDirectory() as temp_dir:
        # Override the upload directory globally
        global UPLOAD_DIR
        UPLOAD_DIR = temp_dir
        
        yield temp_dir
    
    # Restore the original upload directory
    UPLOAD_DIR = original_upload_dir

# Create an in-memory SQLite database for testing
@pytest.fixture(scope="function")
def test_db():
    # Use an in-memory SQLite database for testing
    TEST_DATABASE_URL = "sqlite:///:memory:"
    
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create the tables in the test database
    Base.metadata.create_all(bind=engine)
    
    # Return the session and engine
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after the test
        Base.metadata.drop_all(bind=engine)

# Override the database dependency with our test database
@pytest.fixture(scope="function")
def client(test_db, test_upload_dir):
    def override_get_db():
        try:
            yield test_db
        finally:
            pass  # We'll handle cleanup in the test_db fixture
    
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Create a test client
    with TestClient(app) as client:
        yield client
    
    # Clean up after the test
    app.dependency_overrides = {} 