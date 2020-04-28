const express = require("express");
const dotenv = require("dotenv");
const bootcomps = require("./routes/bootcomps");
// const courses = require("./routes/courses");
// const reviews = require("./routes/reviews");
// const auth = require("./routes/auth");
// const users = require("./routes/users");
const morgan = require("morgan");
const mongo_connect = require("./config/database");

// load env vars
dotenv.config({ path: "./config/config.env" });

// initialize application
const app = express();
app.use(express.json());

// database connection
mongo_connect();

// looger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcomps", bootcomps);
// app.use("/api/v1/courses", courses);
// app.use("/api/v1/reviews", reviews);
// app.use("/api/v1/users", users);
// app.use("/api/v1/auth", auth);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  // close the server and exit
  server.close(() => process.exit(1));
});
