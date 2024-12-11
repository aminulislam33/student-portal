const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const registrationRouter = require('./routes/registrationRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const calculateRouter = require('./routes/sgpaRouter.js');
const subjectRouter = require('./routes/subjectRouter.js');
const marksRouter = require('./routes/marksRoutes.js');
const requestLogger = require('./middlewares/requestLogger');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRouter);
app.use('/api/register', registrationRouter);
app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRouter);
app.use("/api/subjects", subjectRouter);
app.use('/api/marks', marksRouter);
app.use('/api/calculate', calculateRouter);

module.exports = app;