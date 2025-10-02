const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error");
const { errors: celebrateErrors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("App connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB");
    console.error(error);
  });

app.use(cors());

app.use(requestLogger);

app.use("/", indexRouter);

app.use(errorLogger);

app.use(celebrateErrors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Application running at:", `http://localhost:${PORT}`);
});
