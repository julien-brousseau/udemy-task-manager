// Dependancies
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./task");

// Create the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: (v) => { if (!validator.isEmail(v)) throw new Error("Invalid email") }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate: (v) => { if (v.includes("password")) throw new Error("Password can't contain 'password'") }
  },
  age: {
    type: Number,
    default: 0,
    validate: (v) => { if (v < 0) throw new Error("Age must be over 0"); }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

// Relationship with the Task model
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"   // Field in the Task model
})


// METHODS --- Add a function accessible on the instances of the model
// ex: userData.toJSON()

// Overrides toJSON to filter private data for user
userSchema.methods.toJSON = function() {

  // Get all user model as an object
  const user = this.toObject();

  // Remove private properties
  delete user.password
  delete user.tokens
  delete user.avatar

  // Return
  return user;
};

// Generates JSON web token with login info
// Uses a regular function call to allow the use of "this"
userSchema.methods.generateAuthToken = async function() {

  // Create a user token
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SALT);

  // Save token in user model
  this.tokens = this.tokens.concat({ token });
  await this.save();

  // Send back the token
  return token;
};


// STATICS --- Add a function accessible to the model
// ex: User.findByCredentials()

// Find a user with email and password
userSchema.statics.findByCredentials = async (email, password) => {

  // User or error
  const user = await User.findOne({ email })
  if (!user) throw new Error("No such user");

  // Match password or error
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong password");  // Dont use that message IRL

  // Returns the model
  return user;

};


// MIDDLEWARES ---

// Automatically hash password if it's present in the request
// Uses a regular function call to allow the use of "this"
userSchema.pre("save", async function(next) {

  // Hash the plain text password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  // Important to terminate the PRE block
  next();
})

// Delete all user's tasks when user is deleted
userSchema.pre("remove", async function(next) {
  await Task.deleteMany({ owner: this._id });
  next();
})


// ---

// Assign schema to User model
const User = mongoose.model("User", userSchema);


// Export module
module.exports = User;
