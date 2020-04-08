// Fetch the Express application
const app = require("./app");

// Set port
const port = process.env.PORT;

// Launch server
app.listen(port, () => {
  console.log("Server started on port " + process.env.PORT)
});
