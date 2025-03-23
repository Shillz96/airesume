# API Endpoints Documentation

This document provides a comprehensive list of API endpoints available in the AIreHire application, organized by feature area.

## Authentication Endpoints

### User Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/login` | Log in a user | No |
| POST | `/api/register` | Register a new user | No |
| GET | `/api/logout` | Log out current user | Yes |
| GET | `/api/user` | Get current user information | Yes |

### Admin Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/admin-login` | Admin quick login | No |
| POST | `/api/admin/make-admin` | Promote user to admin | No |

## Resume Endpoints

### Resume Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/resumes` | Get all user resumes | Yes |
| GET | `/api/resumes/:id` | Get a specific resume | Yes |
| POST | `/api/resumes` | Create a new resume | Yes |
| POST | `/api/resumes/:id` | Update a resume | Yes |
| DELETE | `/api/resumes/:id` | Delete a resume | Yes |

### Resume Utilities

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/resumes/active` | Get active resume or create sample | Yes |
| GET | `/api/resumes/latest` | Get most recent resume | Yes |
| POST | `/api/resumes/parse` | Parse uploaded resume file | Yes |

### AI-Powered Resume Features

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/resumes/:id/suggestions` | Get AI suggestions for resume | Yes |
| POST | `/api/resumes/:id/tailor` | Tailor resume to job description | Yes |
| POST | `/api/resumes/:id/tailor-to-job/:jobId` | Tailor resume to specific job | Yes |
| POST | `/api/resumes/:id/apply-tailored` | Save tailored resume | Yes |

## Job Endpoints

### Job Search

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/jobs` | Get job listings with filters | Yes |
| GET | `/api/jobs/:id` | Get job details | Yes |
| POST | `/api/jobs/:id/toggle-save` | Save/unsave a job | Yes |
| GET | `/api/saved-jobs` | Get saved jobs | Yes |

### Job Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/applications` | Submit a job application | Yes |
| GET | `/api/applications` | Get user's job applications | Yes |
| POST | `/api/jobs/:id/apply` | Apply to a job | Yes |
| POST | `/api/jobs/:id/tailor-resume` | Tailor resume for job application | Yes |

## Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/api/activities` | Get recent user activities | Yes |

## Subscription Endpoints

### Subscription Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/subscription` | Get user subscription | Yes |
| POST | `/api/subscription` | Create new subscription | Yes |
| PUT | `/api/subscription/:id` | Update subscription | Yes |
| POST | `/api/subscription/:id/cancel` | Cancel subscription | Yes |

### Add-ons

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/addons` | Get user add-ons | Yes |
| POST | `/api/addons` | Purchase add-on | Yes |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/payments` | Get payment history | Yes |

## Document Generation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/generate-pdf` | Generate PDF from resume | Yes |

## Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/admin/stats/users` | Get user statistics | Yes (Admin) |
| GET | `/api/admin/stats/resumes` | Get resume statistics | Yes (Admin) |
| GET | `/api/admin/stats/jobs` | Get job statistics | Yes (Admin) |
| GET | `/api/admin/stats/subscriptions` | Get subscription statistics | Yes (Admin) |

## External API Testing

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/test-adzuna` | Test Adzuna API connection | Yes (Admin) |

## Request/Response Examples

### Authentication

#### Login Request

```javascript
// POST /api/login
{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Login Response

```javascript
{
  "id": 1,
  "username": "user@example.com",
  "isAdmin": false
}
```

### Resume Management

#### Create Resume Request

```javascript
// POST /api/resumes
{
  "title": "Software Developer Resume",
  "template": "professional",
  "content": {
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "headline": "Senior Software Developer",
      "summary": "Experienced software developer with 10+ years in web development."
    },
    "experience": [
      {
        "id": "exp-1",
        "title": "Senior Developer",
        "company": "Tech Company",
        "startDate": "2020-01",
        "endDate": "Present",
        "description": "Led development of web applications using React and Node.js."
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "degree": "B.S. Computer Science",
        "institution": "University",
        "startDate": "2012-09",
        "endDate": "2016-05",
        "description": "Graduated with honors"
      }
    ],
    "skills": [
      { "id": "skill-1", "name": "JavaScript", "proficiency": 5 },
      { "id": "skill-2", "name": "React", "proficiency": 4 }
    ],
    "projects": [
      {
        "id": "proj-1",
        "title": "E-commerce Platform",
        "description": "Built full-stack e-commerce solution",
        "technologies": ["React", "Node.js", "MongoDB"]
      }
    ]
  }
}
```

#### Get Resume Response

```javascript
// GET /api/resumes/1
{
  "id": 1,
  "userId": 1,
  "title": "Software Developer Resume",
  "template": "professional",
  "content": {
    // Resume content as above
  },
  "createdAt": "2023-01-15T12:00:00Z",
  "updatedAt": "2023-01-15T12:00:00Z"
}
```

### Job Search

#### Job Search Request

```javascript
// GET /api/jobs?title=developer&location=remote
```

#### Job Search Response

```javascript
[
  {
    "id": 1,
    "title": "Senior Frontend Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "Full-time",
    "description": "We are looking for a senior frontend developer...",
    "skills": ["JavaScript", "React", "TypeScript"],
    "postedAt": "2023-03-10T10:30:00Z",
    "expiresAt": "2023-04-10T10:30:00Z",
    "applyUrl": "https://example.com/apply/1",
    "match": 85,
    "isNew": true,
    "saved": false
  }
]
```

### AI Features

#### Resume Suggestions Request

```javascript
// GET /api/resumes/1/suggestions
```

#### Resume Suggestions Response

```javascript
{
  "suggestions": [
    "Add more quantifiable achievements to your work experience",
    "Include relevant keywords from job descriptions in your target field",
    "Consider reorganizing skills section to highlight most relevant skills first",
    "Add a projects section to showcase your practical experience"
  ]
}
```

#### Tailor Resume Request

```javascript
// POST /api/resumes/1/tailor
{
  "jobDescription": "We are looking for a frontend developer with experience in React, TypeScript, and state management libraries...",
  "jobTitle": "Senior Frontend Developer",
  "company": "Tech Corp"
}
```

#### Tailor Resume Response

```javascript
{
  "tailoredResume": {
    "personalInfo": {
      // Updated personal info with tailored summary
    },
    "experience": [
      // Tailored experience entries highlighting relevant skills
    ],
    "skills": [
      // Reordered and enhanced skills matching job requirements
    ]
  },
  "matchScore": 85,
  "keywordMatches": ["React", "TypeScript", "frontend"]
}
```

## Error Responses

All API endpoints follow a consistent error response format:

```javascript
{
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (only in development)"
}
```

Common HTTP status codes:

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## API Rate Limiting

The API implements basic rate limiting:

- **Regular users**: 100 requests per minute
- **Premium users**: 300 requests per minute

## Authentication

All authenticated endpoints require a valid session cookie obtained through login.

The server uses Express sessions with Passport.js for authentication.

To access admin endpoints, the user must have `isAdmin: true` in their user record.