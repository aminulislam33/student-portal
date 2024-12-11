const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const profileRouter = require('./routes/profileRoute');
const userRouter = require('./routes/userRoutes.js');
const requestLogger = require('./middlewares/requestLogger');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(requestLogger);

app.use('/api/register', userRouter)
app.use('/api/user', profileRouter);

app.get('/', (req,res)=>{
    return res.status(201).json({msg: "Hello from server"});
});

module.exports = app;