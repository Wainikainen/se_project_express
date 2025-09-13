const express = require("express");
const mongoose = require('mongoose');
const { PORT = 3001 } = process.env
const app = express();
const indexRouter = require("./routes/index");

app.use((req, res, next) => {
  req.user = {
    _id: "68c4d40991ded55217d9cf39"
  };
  next();
});

app.use(express.json());

mongoose.connect(
  'mongodb://127.0.0.1:27017/wtwr_db'
);

app.use("/", indexRouter)

app.listen(PORT, () => {});
