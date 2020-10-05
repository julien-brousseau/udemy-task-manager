// Dependancies
const mongoose = require("mongoose");

// Create the schema
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Relationship with the User model, used with schema.virtual in model
    // Call with task.populate('owner').execPopulate()
    ref: "User"
  }
}, {
  timestamps: true
});

// Task model schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
