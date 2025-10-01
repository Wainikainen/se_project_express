const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
