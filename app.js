const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const profileRouter = require('./routes/profileRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const gpaRouter = require('./routes/sgpaRouter.js');
const subjectRouter = require('./routes/subjectRouter.js');
const marksRouter = require('./routes/marksRoutes.js');
const studentsRouter = require('./routes/studentRoutes.js');
const departmentRouter = require('./routes/departmentRoutes.js');
const courseRouter = require('./routes/courseRoutes.js');
const semesterRouter = require('./routes/semesterRoutes.js');
const bulkEntryRouter = require('./routes/bulkEntryRoutes.js');
const facultyRouter = require('./routes/facultyRoutes.js');
const requestLogger = require('./middlewares/requestLogger');
const { verifyToken } = require('./middlewares/authMiddleware.js');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(requestLogger);

app.get('/', (req,res)=>{return res.status(200).json({message: "Hello from server"})});
app.use('/api/auth', authRouter);
app.use(verifyToken);
app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRouter);
app.use('/api/gpa', gpaRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/faculties', facultyRouter);
app.use('/api/semesters', semesterRouter);
app.use("/api/subjects", subjectRouter);
app.use('/api/students', studentsRouter);
app.use('/api/marks', marksRouter);
app.use('/api/bulkentry', bulkEntryRouter);

module.exports = app;