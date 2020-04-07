// Dependancies
const express = require("express");

// Custom database configuration
require("./db/mongoose");

// Routers
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Server settings
const app = express();
const port = process.env.PORT;

// Automatically convert to JSON
app.use(express.json());

// Define routers
app.use(userRouter);
app.use(taskRouter);

// Launch server
app.listen(port, () => {
  console.log("Server started on port " + process.env.PORT)
});
