const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRouter = require('./routes/studentRoute');
const userRouter = require('./routes/profileRoute');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get('/', (req,res)=>{
    return res.status(201).json({msg: "Hello from server"});
});

module.exports = app;