// Dependancies
const express = require("express");

// Mongoose model
const Task = require("../models/task");

// Auth module used in routes
const auth = require("../middleware/auth")

// Express router
const router = new express.Router();

// Create a new task
// Params:  [Boolean] completed
//          [Int] limit
//          [Int] skip
//          [] sortBy = createdAt:desc
router.post("/tasks", auth, async (req, res) => {

  // Create a task object and add current user ID as owner
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  // Save the task
  try {
    await task.save();
    res.status(201).send(task);

  // Error
  } catch (e) {
    res.status(400).send(e);
  }

});

// Fetch all of current user's tasks
router.get("/tasks", auth, async (req, res) => {

  // Filter completed true/false/undefined
  const match = {};
  if (req.query.completed) match.completed = req.query.completed === "true"

  // Filter sortBy parameters
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  // Fetch all tasks from User
  try {
    await req.user.populate({   // Relationship with User
      path: "tasks",            // Model to use
      match,                    // Filter
      options: {                // Pagination parameters
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)

  } catch (e) {
    res.status(500).send(e)
  }

});

// Fetch a user's single task
router.get("/tasks/:id", auth, async (req, res) => {

  try {
    // Find a task with the correct _id and owner
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) return res.status(404).send();
    res.send(task)

  } catch (e) {
    res.status(500).send(e);
  }

});

// Update a single task
router.patch("/tasks/:id", auth, async (req, res) => {

  // Fails if a property isnt allowed
  const updates = Object.keys(req.body);
  const alwUpdates = ["description", "completed"]
  const isValidOperation = updates.every(p => alwUpdates.includes(p));

  if (!isValidOperation) return res.status(400).send({ error: "Invalid update" })

  // Find and update the task model
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    // If no task is found, send 404
    if (!task) return res.status(404).send();

    // Else update and save
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    // Return updated task data
    res.send(task);

  // Catch errors
  } catch (e) {
    res.status(500).send(e);
  }

});

// Delete a single task
router.delete("/tasks/:id", auth, async (req, res) => {

  try {
    // Try to find and delete the task with the correct owner
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    // 404 if no task
    if (!task) return res.status(404).send();

    // Send the task data
    res.send(task);

  // Server error
  } catch (e) {
    res.status(500).send(e)
  }

});


// Export module
module.exports = router;
