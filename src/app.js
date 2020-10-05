// Dependancies
const express = require("express");

// Custom database configuration
require("./db/mongoose");

// Routers
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Server settings
const app = express();

// Automatically convert to JSON
app.use(express.json());

// Define routers
app.use(userRouter);
app.use(taskRouter);


module.exports = app;
