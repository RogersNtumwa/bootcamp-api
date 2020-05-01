const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please enter a title"] },
  description: {
    type: String,
    required: [true, "Please provide a description for you course "],
  },
  duration: {
    type: String,
    required: [true, "Please enter the duration of study for the course"],
  },
  tuition: { type: Number, required: [true, "Please provide tuition amount"] },
  minimumSkill: {
    type: String,
    required: [true, "Please enter minimum skills"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now() },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcomp",
    required: [true, "Please enter bootcomp"],
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
