import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database connection URL with fallback
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.warning("DATABASE_URL environment variable not set, using default SQLite database")
    DATABASE_URL = "sqlite:///./test.db"
else:
    logger.info(f"Using database URL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'sqlite'}")

# Create SQLAlchemy engine with proper handling of special characters
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    # Create SQLAlchemy engine with echo for debugging in development
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("ENVIRONMENT") == "development",
        pool_size=5,
        max_overflow=10
    )
    # Test the connection
    with engine.connect() as conn:
        conn.execute("SELECT 1")
    logger.info("Database connection test successful")
except Exception as e:
    logger.error(f"Error connecting to database: {str(e)}")
    # Fallback to SQLite
    DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(DATABASE_URL)
    logger.warning("Using fallback SQLite database")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 