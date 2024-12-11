const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

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