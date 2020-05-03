const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bootcomps = require("./routes/bootcomps");
const courses = require("./routes/courses");
const fileuplaod = require("express-fileupload");
// const auth = require("./routes/auth");
// const reviews = require("./routes/reviews");
const auth = require("./routes/auth");
const morgan = require("morgan");
const mongo_connect = require("./config/database");
const colors = require("colors");
const errorhandler = require("./middleware/error");
const cookieParser = require("cookie-parser");

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

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/bootcomps", bootcomps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
// app.use("/api/v1/reviews", reviews);
// app.use("/api/v1/auth", auth);

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
