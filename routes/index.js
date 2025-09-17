const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", createUser);
router.post("/login", login);


router.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
