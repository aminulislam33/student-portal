# Online MCQ-Based Exam System

Welcome to the **Online MCQ-Based Exam System**! This platform allows administrators to create exams and manage users, while students can take exams in a structured and secure manner.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

The Online MCQ-Based Exam System is designed to provide an easy-to-use platform for conducting aptitude-based exams with single or multiple correct answers. It ensures secure login, token-based authentication, and time-bound exam management for students.

---

## Features
- **User Roles:** Administrator and Student roles.
- **Authentication:** Secure login and signup using JWT and bcrypt.
- **Exam Management:**
  - Create, update, and delete exams.
  - Schedule exams with start and end times.
- **Question Management:**
  - Add single or multiple-correct MCQ questions.
- **Exam Taking:**
  - Fetch questions dynamically.
  - Submit answers and calculate scores automatically.
- **Responsive Design:** Mobile-friendly interface using Bootstrap/Tailwind.

---

## Technologies Used

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Docker** for containerization

### Frontend
- **React.js** with Context API for global state management
- **React Router** for navigation
- **Bootstrap/Tailwind CSS** for UI styling

---

## Installation

### Prerequisites
- **Node.js** (v16 or later)
- **MongoDB** (local or cloud instance)
- **Docker** (optional, for containerization)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/online-exam-system.git
   cd online-exam-system
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` directory:
     ```
     PORT=8000
     MONGO_URI=mongodb://localhost:27017/exam-system
     JWT_SECRET=your_jwt_secret
     ```
   
   - Start the server:
     ```bash
     npm start
     ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run with Docker (Optional):**
   - Build and run containers:
     ```bash
     docker-compose up --build
     ```

---

## Usage Guide

### Administrator
1. **Login/Signup**: Navigate to `/admin/login` to access the admin dashboard.
2. **Create Exams**: Schedule exams with start and end times.
3. **Manage Questions**: Add MCQs for the exams.

### Students
1. **Login/Signup**: Use `/login` to access the student dashboard.
2. **Take Exams**:
   - Navigate to available exams.
   - Start the exam (available only during the scheduled time).
   - Submit answers within the time limit.
3. **View Results**: Check scores after submission.

---

## API Reference

### Authentication
| Endpoint         | Method | Description             |
|------------------|--------|-------------------------|
| `/api/auth/signup` | POST   | Create a new user       |
| `/api/auth/login`  | POST   | Login and get JWT token |

### Exam Management (Admin)
| Endpoint               | Method | Description                   |
|------------------------|--------|-------------------------------|
| `/api/exams`            | POST   | Create a new exam             |
| `/api/exams/:id`        | GET    | Fetch details of an exam      |
| `/api/exams/:id`        | PUT    | Update an existing exam       |
| `/api/exams/:id`        | DELETE | Delete an exam                |

### Question Management (Admin)
| Endpoint                  | Method | Description                     |
|---------------------------|--------|---------------------------------|
| `/api/questions`          | POST   | Add questions to an exam        |
| `/api/questions/:examId`  | GET    | Fetch all questions for an exam |

### Exam Taking (Student)
| Endpoint                 | Method | Description                       |
|--------------------------|--------|-----------------------------------|
| `/api/exam-taking/start` | POST   | Fetch questions for a given exam |
| `/api/exam-taking/submit`| POST   | Submit answers and calculate score |

---

## Project Structure

```
online-exam-system
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── utils
│   └── app.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── App.js
├── docker-compose.yml
└── README.md
```

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions or feedback, feel free to contact:
- **Project Supervisor:** Dr. Suvarun Dalapati
- **Project Guide:** Mr. Debanjan Dhara
- **Team:** [Your Team Members]