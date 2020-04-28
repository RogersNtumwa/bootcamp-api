const express = require("express");
const dotenv = require("dotenv");
const bootcomps = require("./routes/bootcomps");
// const courses = require("./routes/courses");
// const reviews = require("./routes/reviews");
// const auth = require("./routes/auth");
// const users = require("./routes/users");

// load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

app.use("/api/v1/bootcomps", bootcomps);
// app.use("/api/v1/courses", courses);
// app.use("/api/v1/reviews", reviews);
// app.use("/api/v1/users", users);
// app.use("/api/v1/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
