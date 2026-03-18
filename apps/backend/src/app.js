const express = require("express");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");
const cors = require("cors");
const passport = require("./config/passport");

const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use("/api", routes);
app.use(errorMiddleware);
module.exports = app;
