const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();
dotenv.config();
connectDB();

app.get('/', (req,res)=>{
    return res.status(201).json({msg: "Hello from server"});
});

module.exports = app;