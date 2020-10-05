// Dependancies
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

// Temp user to be signed up
const testUser0 = {
  name: "Darth Vader",
  email: "vader@deathstar.us",
  password: "q1w2e3r4t5y6",
}

// Temp user logged in via setupDatabase()
const testUser1Id = new mongoose.Types.ObjectId();
const testUser1 = {
  _id: testUser1Id,
  name: "Luke Skywalker",
  email: "luke@tatooine.com",
  password: "q1w2e3r4t5y6",
  tokens: [{
    token: jwt.sign({ _id: testUser1Id }, process.env.JWT_SALT)
  }]
}

// Second user
const testUser2Id = new mongoose.Types.ObjectId();
const testUser2 = {
  _id: testUser2Id,
  name: "Han Solo",
  email: "han@smugglers.org",
  password: "q1w2e3r4t5y6",
  tokens: [{
    token: jwt.sign({ _id: testUser2Id }, process.env.JWT_SALT)
  }]
}

// Tasks
const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: "New Task 1",
  completed: false,
  owner: testUser1Id
}
const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: "New Task 2",
  completed: true,
  owner: testUser1Id
}
const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: "New Task 3",
  completed: true,
  owner: testUser2Id
}


// Empty Database
const setupDatabase = async () => {

  // Clear database
  await User.deleteMany();
  await Task.deleteMany();

  // Add hardcoded new users
  await new User(testUser1).save();
  await new User(testUser2).save();

  // Add hardcoded tasks
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
}

module.exports = {
  testUser0,
  testUser1,
  testUser2,
  testUser1Id,
  testUser2Id,
  task1,
  task2,
  task3,
  setupDatabase
};
