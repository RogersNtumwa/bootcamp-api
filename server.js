const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bootcomps = require("./routes/bootcomps");
const courses = require("./routes/courses");
const fileuplaod = require("express-fileupload");
const reviews = require("./routes/reviews");
const auth = require("./routes/auth");
const users = require("./routes/users");
const morgan = require("morgan");
const mongo_connect = require("./config/database");
const colors = require("colors");
const errorhandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const ratelimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// load env vars
dotenv.config({ path: "./config/config.env" });

// initialize application
const app = express();
app.use(express.json());

// cookie parser
app.use(cookieParser());

// database connection
mongo_connect();

// looger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// file uploading
app.use(fileuplaod());

// set secure headers
app.use(helmet());
// Prevent xss attacks
app.use(xss());
// Rate limiting
const limiter = ratelimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// sanitaze data
app.use(mongoSanitize());
// Routes
app.use("/api/v1/bootcomps", bootcomps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorhandler);
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  // close the server and exit
  server.close(() => process.exit(1));
});
