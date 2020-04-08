// Express testing module
const request = require("supertest");

// For user testing
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Load the app (doesnt not launch server)
const app = require("../src/app");

// User model
const User = require("../src/models/user");

// Temp user
const testUser1Id = new mongoose.Types.ObjectId();
const testUser1 = {
  _id: testUser1Id,
  name: "Darth Vader",
  email: "vader@jsdnvisdv.com",
  password: "q1w2e3r4t5y6",
  tokens: [{
    token: jwt.sign({ _id: testUser1Id }, process.env.JWT_SALT)
  }]
}

// Set default database testing data
beforeEach(async () => {
  // Clear user database
  await User.deleteMany();
  // Add a new user
  await new User(testUser1).save();
});


// User tests

test("Should signup a new user", async () => {

  // Try to sign up test user
  const response = await request(app).post("/users").send({
    name: "Darth Vader",
    email: "djoolien@gmail.com",
    password: "q1w2e3r4t5y6"
  }).expect(201)

  // Check if the user is saved to the database
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Check if the stored user match the test data
  expect(response.body).toMatchObject({
    user: {
      name: "Darth Vader",
      email: "djoolien@gmail.com"
    }, token: user.tokens[0].token
  });

  // Check if the password is not stored in plain text
  expect(user.password).not.toBe("q1w2e3r4t5y6");

});

test("Should login existing user", async () => {

  // Check if the user can log in
  const response = await request(app).post("/users/login")
  .send({
    email: testUser1.email,
    password: testUser1.password
  })
  .expect(200)

  // Check if the login token is saved in db
  const user = await User.findById(testUser1Id);
  expect(response.body.token).toBe(user.tokens[1].token);

});

test("Should not login nonexistent user", async () => {
  await request(app).post("/users/login").send({
    email: "blop@gmail.com",
    password: "12345678"
  }).expect(400)
});

test("Should get user profile", async () => {
  await request(app).get("/users/me")
    .set("Authorization", `Bearer ${testUser1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile from unauthenticated user", async () => {
  await request(app).get("/users/me")
    .send()
    .expect(401);
})

test("Should delete account for user", async () => {

  await request(app).delete("/users/me")
    .set("Authorization", `Bearer ${testUser1.tokens[0].token}`)
    .send()
    .expect(200);

  // Check if the user is deleted
  const user = await User.findById(testUser1Id);
  expect(user).toBeNull();

})

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me")
    .send()
    .expect(401);
})

test("Should upload image for user avatar", async () => {
  await request(app).post("/users/me/avatar")
    // Set auth token to the request
    .set("Authorization", "Bearer " + testUser1.tokens[0].token)
    // Attach file
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200)

  // Check iif the avatar contains a image buffer
  const user = await User.findById(testUser1Id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update user fields", async () => {
  await request(app).patch("/users/me")
    .set("Authorization", `Bearer ${testUser1.tokens[0].token}`)
    .send({
      name: "Luke Skywalker"
    })
    .expect(200)
    const user = await User.findById(testUser1Id);
    expect(user.name).toEqual("Luke Skywalker");
});

test("Should not update invalid user fields", async () => {
  await request(app).patch("/users/me")
    .set("Authorization", `Bearer ${testUser1.tokens[0].token}`)
    .send({
      location: "blop"
    })
    .expect(400)
});
