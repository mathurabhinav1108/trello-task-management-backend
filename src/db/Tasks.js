const mongoose = require("mongoose");

const Taskschema = mongoose.Schema({
  userId: {
    type: String,
  },
  uuid: {
    type: String,
  },
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  status: {
    type: String,
  },
  priority: {
    type: String,
  },
  deadline: {
    type: String,
  },
  deadline: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("tasks", Taskschema);
