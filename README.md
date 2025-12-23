# Student Portal - Project Documentation

## Project Overview
**Student Portal** is a comprehensive backend API for managing student, faculty, and administrative operations in a college. Built with Node.js/Express and MongoDB, it provides role-based access control for students, professors, HODs, and administrators.

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing
- **File Upload**: Multer + Cloudinary
- **Email Service**: Nodemailer
- **Bulk Import**: XLSX
- **Logging**: Winston
- **Environment**: Dotenv

---

## Project Structure

### Core Entry Points
- **server.js**: Application server initialization (listens on configured port)
- **app.js**: Express app setup with middleware configuration and route mounting
- **package.json**: Dependencies and npm scripts (`npm start`, `npm run dev` with nodemon)

### Configuration Files
- **config/db.js**: MongoDB connection setup
- **config/cloudinary.js**: Cloudinary storage configuration for file uploads
- **cors.js**: CORS policy configuration with environment-based allowed origins

### Middleware
- **authMiddleware.js**: JWT token verification and role-based access control
  - `verifyToken`: Validates JWT and extracts userId and userRole
  - `isAdmin`, `isProfessor`, `isHOD`: Role-specific guards
- **requestLogger.js**: Request logging using Winston

---

## Database Models

### User (Base Authentication Model)
Stores authentication data for all user types.
- **Fields**: fullName, email, phone, photo (default by gender), gender, password (hashed), role, timestamps
- **Roles**: student, professor, HOD, admin
- **Default Photos**: Gender-based default images from Cloudinary

### Student
Links to User model; stores enrollment and academic details.
- **Fields**: DBid (User reference), EnrollmentId (unique), course, yearOfAdmission, department, currentSemester, otp, otpExpires, timestamps
- **Relations**: References Course, Department, Semester

### Faculty
Links to User model; stores faculty-specific information.
- **Fields**: DBid (User reference), facultyID (unique), designation (Assistant/Associate/Professor), department, joiningYear, isHOD, otp, otpExpires, timestamps
- **Relations**: References Department

### Marks
Records student performance across subjects and semesters.
- **Fields**: course, department, studentId, subjectId, semester, midSemMarks, endSemMarks, internalAssessment, timestamps
- **Min Value**: 0 for all mark fields

### Subject
Defines subjects offered in semesters.
- **Fields**: course, department, semester, subjectCode (unique), subjectName, fullMarks, credits, type (theory/lab/other), timestamps
- **Relations**: References Course, Department, Semester

### Course
Top-level academic program structure.
- **Fields**: name, type (Undergraduate/Postgraduate/Doctorate), duration (years), totalCredits, departments (array), timestamps

### Department
Organizational unit housing courses and faculty.
- **Fields**: name, abbreviation (unique), description, faculties (array), head, courses (array), timestamps

### Semester
Time period within a course when specific subjects are offered.
- **Fields**: semesterNumber, year, department, course, startDate, endDate (validated > startDate), subjects (array), totalCredits, totalMarks, students (array), timestamps

---

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /user/login` - General user login (email + password)
- `POST /student/login` - Student login (EnrollmentId + password)

### Student Registration (`/api/register/student`)
- `POST /initiate` - Start account setup with OTP
- `POST /verify` - Verify OTP
- `POST /password` - Create password for newly registered student

### Admin Registration (`/api/register/admin`)
- Admin registration endpoints (requires token)

### Profile Management (`/api/profile`)
- Profile view and update endpoints (requires token)

### Academic Management
- **Courses** (`/api/courses`): Add, get all, get by ID, update, delete
- **Departments** (`/api/departments`): Add, get all, get by ID, update, delete
- **Subjects** (`/api/subjects`): CRUD operations
- **Semesters** (`/api/semesters`): CRUD operations
- **Faculty** (`/api/faculties`): Account setup with OTP verification, add faculty
- **Students** (`/api/students`): Add, retrieve, manage students
- **Marks** (`/api/marks`): Record and retrieve student marks

### SGPA Calculation (`/api/gpa`)
- `GET /` - Calculate SGPA for current semester
  - Grading: >=90=10, >=80=9, >=70=8, >=60=7, >=50=6, >=40=5, <40=0
  - Formula: (Σ grade-points × credits) / Σ credits
  - Requires marks from all subjects

### Bulk Data Entry (`/api/bulkentry`)
- `POST /professors` - Upload faculty data via Excel
- `POST /semesters` - Upload semester data via Excel
- `POST /subjects` - Upload subject data via Excel
- `POST /students` - Upload student data via Excel
- `POST /marks` - Upload marks data via Excel

---

## Key Features

### Authentication & Authorization
- JWT-based stateless authentication (1-hour expiration)
- Password hashing with Bcrypt (10 salt rounds)
- Role-based access control (student, professor, HOD, admin)
- Public endpoints: login and registration initialization
- Protected endpoints: require valid JWT token

### Account Setup Flow
1. Student registration via EnrollmentId
2. OTP sent to institute email
3. OTP verification (15-minute expiration)
4. Password creation by student
5. Ready for login

### SGPA Calculation
- Weighted average of grade points
- Grade points based on percentage ranges
- Requires complete mark entries for all subjects in semester
- Returns SGPA to 2 decimal places

### Bulk Data Import
- Supports Excel file uploads for multiple entities
- Efficiently populate database with large datasets
- Supports: faculty, semesters, subjects, students, marks

### File Upload & Storage
- Multer integration with Cloudinary
- User profile photos stored on Cloudinary
- Default photos based on gender from Cloudinary URLs

---

## Data Relationships

```
User (Base)
├── Student (1:1 via DBid)
│   ├── Course
│   ├── Department
│   └── CurrentSemester
│       ├── Subjects []
│       └── Marks (via student-subject pair)
└── Faculty (1:1 via DBid)
    ├── Department
    └── Courses (via Department)

Course
├── Departments []
└── Semesters []

Department
├── Faculties []
├── Head (Faculty reference)
└── Courses []

Semester
├── Subjects []
├── Students []
└── Course reference

Subject
├── Marks []
└── Course/Department references

Marks
├── Student
├── Subject
└── Semester
```

---

## Utilities

### addUser.js
Helper function to create new User documents with default values.

### calculateSGPA.js
Calculates semester GPA by:
1. Fetching marks for all subjects in semester
2. Computing grade points based on percentage
3. Calculating weighted average using credits
4. Handling missing mark entries with proper error messages

### otpGenerator.js
Generates random 6-digit OTPs for account verification.

### logger.js
Winston-based logging configuration for monitoring and debugging.

---

## Environment Variables Required
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port
- `CORS_URL` - Allowed origin for CORS
- `EMAIL_USER` - Gmail account for OTP sending
- `EMAIL_PASS` - Gmail app password
- `CLOUDINARY_*` - Cloudinary API credentials

---

## Security Features
- JWT authentication with expiration
- Password hashing with Bcrypt (10 rounds)
- Role-based access control middleware
- CORS configuration with whitelisted origins
- OTP-based account verification with time expiration
- Input validation in models (phone regex, enum constraints)

---

## Development Commands
- `npm start` - Start production server
- `npm run dev` - Start with auto-reload (nodemon)

---

## Status & Notes
- Core functionality implemented: authentication, CRUD operations, SGPA calculation
- Bulk import system for data population
- Student account setup with email OTP verification
- Profile management infrastructure in place
- Ready for frontend integration