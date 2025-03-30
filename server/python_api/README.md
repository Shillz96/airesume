# AllHire Resume Upload API

This is a Python-based FastAPI application that provides a backend for resume uploads, parsing, and management in the AllHire platform.

## Features

- Resume file upload with background processing
- Resume parsing from various file formats
- RESTful API for managing resumes and upload records
- SQLAlchemy ORM for database interactions
- Alembic for database migrations

## Setup

### Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- Python dependencies listed in `requirements.txt`

### Environment Variables

Create a `.env` file in the `server/python_api` directory with the following variables:

```
DATABASE_URL=postgresql+psycopg2://username:password@localhost/database_name
```

For development, you can use the same PostgreSQL database that the existing TypeScript backend uses.

### Installation

1. Install the required Python packages:

```bash
cd server/python_api
pip install -r requirements.txt
```

2. Create the database:

```bash
# If using a new database
createdb database_name
```

3. Run database migrations:

```bash
cd server/python_api/migrations
alembic upgrade head
```

### Running the API Server

```bash
cd server/python_api
uvicorn main:app --reload
```

The API will be available at http://localhost:8000.

## API Endpoints

### Resume Upload

- **POST /uploads/resume/** - Upload a new resume file
  - Parameters:
    - `user_id` (int, form data)
    - `file` (file upload)
  - Returns: Upload record with status

### Resume Upload Management

- **GET /uploads/resume/{upload_id}** - Get details of a specific upload
- **GET /uploads/resume/user/{user_id}** - Get all uploads for a user
- **DELETE /uploads/resume/{upload_id}** - Delete an upload record and its file

### Resume Management

- **GET /resumes/{resume_id}** - Get a specific resume
  - Parameters:
    - `user_id` (int, query parameter) - For security, ensures the requester owns the resume
- **GET /resumes/user/{user_id}** - Get all resumes for a user
- **DELETE /resumes/{resume_id}** - Delete a resume
  - Parameters:
    - `user_id` (int, query parameter)

## Integration with Existing Application

This Python API is designed to work alongside the existing TypeScript/Node.js backend. It handles the resume upload and parsing functionality, while the existing backend continues to handle other application features.

To integrate this with the frontend, update the client-side code to post resume files to this API's endpoints instead of the existing endpoints.

## Development

### Creating New Database Migrations

After making changes to the SQLAlchemy models:

```bash
cd server/python_api/migrations
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Extending Resume Parsing

To improve resume parsing capabilities, update the `ResumeParser` class in `resume_parser.py`. Consider integrating with specialized libraries for different file formats and NLP tools for better extraction of structured data from resumes. 