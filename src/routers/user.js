// Dependancies
const express = require("express");

// Mongoose model
const User = require("../models/user");

// File upload library
const multer = require("multer");

// Image handling library
const sharp = require("sharp");

// Express middlewares, used in route declarations
const auth = require("../middleware/auth");

// Email modules
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/account");

// -----

// Express router
const router = new express.Router();

// Signup user
router.post("/users", async (req, res) => {

  // Create User model from post data
  const user = new User(req.body);

  // Save using async
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});

  // Server error
  } catch (e) {
    console.log(e)
    res.status(400).send();
  }

  // Save process before async
  // user.save()
  //   .then(r => {
  //     res.status(201).send(user);
  //   })
  //   .catch(e => {
  //     res.status(400).send(e);
  //   });

});

// Login user
router.post("/users/login", async (req, res) => {

  // Call custom function in model to find hashed password, returns user if found
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    // Return user and token data
    res.send({ user, token });

  // Server error
  } catch (e) {
    // console.log(e)
    res.status(400).send();
  }

});

// Logout user
router.post("/users/logout", auth, async (req, res) => {

  try {
    // Change the user token array to remove the current one
    req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)

    // Save and send
    await req.user.save();
    res.send();

  // Catch error
  } catch (e) {
    console.log(e);
    re.status(500).send()
  }
});

// Logout all from user (remove all tokens)
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    re.status(500).send()
  }
})

// Fetch the user profile (with middleware Auth)
router.get("/users/me", auth, async (req, res) => {
  // Get profile contained in the header from Auth middleware
  res.send(req.user)
});

// Update the current user
router.patch("/users/me", auth, async (req, res) => {

  // Array of strings for peroperties of User
  const updates = Object.keys(req.body);

  // Changeable properties
  const alwUpdates = ["name", "email", "password", "age"];

  // Fails if a property isnt allowed
  const isValidOperation = updates.every(u => alwUpdates.includes(u));
  if (!isValidOperation) return res.status(400).send({ error: "Invalid update" })

  // Update the model using middleware
  try {
    updates.forEach(update => req.user[update] = req.body[update]);

    // Save the user and send it back
    await req.user.save();
    res.send(req.user);

  // Server error
  } catch (e) {
    res.status(500).send(e);
  }

});

// Delete the current user
router.delete("/users/me", auth, async (req, res) => {

  // Find and delete the user
  try {
    await req.user.remove()
    sendGoodbyeEmail(req.user.email, req.user.name)
    res.send(req.user);

  // Catch server errors
  } catch (e) {
    res.status(500).send(e);
  }

});

// Upload user avatar
const upload = multer({

  // Destination directory -- Bypassed to pass Buffer to the function to store into DB
  // dest: "avatars",

  // File size limit
  limits: { fileSize: 1000000 },

  // Filter file extensions
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Wrong file type"));
    }
    callback(undefined, true);
  }
});

// Route with multiple middlewares
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {

  // Modify image buffer with Sharp (resize + png format)
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })  // Crops image by default
    .png()
    .toBuffer();

  // Save binary data of the file to the model
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
},
// Error handling
(error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

// Delete user avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// Fetch user avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {

    // Fetch user and check if it has an avatar
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Nope!")
    }

    // Set headers and return image
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);

  // Catch errors
  } catch (e) {
    console.log(e);
    res.status(404).send()
  }
});


// Export module
module.exports = router;
