// Dependancies
const mongoose = require("mongoose");

// Mongoose connection & settings
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
