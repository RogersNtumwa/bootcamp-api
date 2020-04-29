const mongoose = require("mongoose");
const slugify = require("slugify");

const bootcompSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please anter a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can't be longer than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please anter a description"],
    maxlength: [500, "Description can't be longer than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phoneNumber: {
    type: String,
    maxlength: [20, "Phone number can't be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "Please enter a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "please add your address"],
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedaddress: String,
    street: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    enum: [
      "Web Development",
      "UI/UX",
      "Mobile Development",
      "Data Science",
      "Business",
      "Others",
    ],
  },
  aveargeRating: {
    type: Number,
    min: [1, "Rating must be atleast 1"],
    max: (10, "Rating can not be more than 10"),
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGaurantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Create slug from the name
bootcompSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {lower:true})
  next();
});

const Bootcomp = mongoose.model("Bootcomp", bootcompSchema);
module.exports.Bootcomp = Bootcomp;
