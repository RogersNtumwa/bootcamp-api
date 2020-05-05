const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
  },
  text: {
    type: String,
    required: [true, "Please provide some text "],
    minlength: 10,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please enter a rating between 1 and 10 "],
  },
  createdAt: { type: Date, default: Date.now() },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcomp",
    required: [true, "Please enter bootcomp"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please enter a User"],
  },
});
// Prevent multiple reviews from a single user
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static methos to get average rating
reviewSchema.statics.getAvearageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averagerRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Bootcomp").findByIdAndUpdate(bootcampId, {
      averagerRating: obj[0].averagerRating,
    });
  } catch (error) {
    console.error(error);
  }
};

// ?Get average rating after saving
reviewSchema.post("save", function (next) {
  this.constructor.getAvearageRating(this.bootcamp);
});

// Get average rating before remove
reviewSchema.pre("remove", function (next) {
  this.constructor.getAvearageRating(this.bootcamp);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
