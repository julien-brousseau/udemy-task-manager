const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Auth middleware, check if user is valid and adds it to the response header
const auth = async (req, res, next) => {

  try {
    // Get token sent in current request headers, then remove the "Bearer " from the beginning to test it
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SALT)

    // Find a user with the correct _id and the valid token stored
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    // Fail if user is not valid
    if (!user) throw new Error()

    // Add the user and token data to the response header to make it accessible
    req.token = token;
    req.user = user;
    next();

  // Auth error
  } catch (e) {
    console.log(e)
    res.status(401).send({ error: "Auth failed" })
  }
};

// Maintenance mode -- send to another file eventually
// app.use((req, res, next) => {
//   res.status(503).send("Maintenance mode")
//   console.log("Maintenance Mode")
// })

module.exports = auth;

// Bearer token, provided for Auth. Send as header to test login tokens
// Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg4Zjc3YjE0ODViMTE2NzA0MWMyNzAiLCJpYXQiOjE1ODYxOTcxODl9.gmnOsD_fQlrf58CgNNHs2Nw9DKffglK70uG3drtkIwA
