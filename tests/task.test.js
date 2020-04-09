// Express testing module
const request = require("supertest");

// Load the app (doesnt not launch server)
const app = require("../src/app");

// Task model
const Task = require("../src/models/task");

// Temporary user and task info
const {
  testUser1,
  testUser1Id,
  testUser2,
  testUser2Id,
  task1,
  task2,
  task3,
  setupDatabase
} = require("./fixtures/db");

// Reset database every time tests are run
beforeEach(setupDatabase);

// Tests

test("Should create new task for user", async () => {

  // Check if the task is created
  const response = await request(app).post("/tasks")
    .set("Authorization", "Bearer " + testUser1.tokens[0].token)
    .send({
      description: "Blop!"
    });
    expect(201);

    // Check if the task is in the database, and not completed
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test("Should get all tasks for users", async () => {

  // Check if the request succeed
  const response = await request(app).get("/tasks")
    .set("Authorization", "Bearer " + testUser1.tokens[0].token)
    .send()
  expect(200);

  // Check if all tasks are loaded
  expect(response.body.length).toEqual(2);
});

test("Should not delete other user's tasks", async () => {

  // Check if user2 can delete user1's task
  const response = await request(app).delete("/tasks/" + task1._id)
    .set("Authorization", "Bearer " + testUser2.tokens[0].token)
    .send()
  expect(404)

  // Check if the task is still in database
  const task = await Task.findById(task1._id);
  expect(task).not.toBeNull();
})

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
