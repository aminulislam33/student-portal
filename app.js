const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const registrationRouter = require('./routes/registrationRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const requestLogger = require('./middlewares/requestLogger');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRouter);
app.use('/api/register', registrationRouter);
app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRoutes);

module.exports = app;