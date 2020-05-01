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
// Static methos to get aerage of courses tuitions
courseSchema.statics.getAvearageCost = async function (bootcampId) {
  console.log("Calculating average cost...".blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcomp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// ?Get average cost after saving
courseSchema.post("save", function (next) {
  this.constructor.getAvearageCost(this.bootcamp);
});

// ?Get average cost before remove
courseSchema.pre("remove", function (next) {
  this.constructor.getAvearageCost(this.bootcamp);
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
