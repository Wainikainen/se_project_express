const router = require("express").Router();
const { getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/:userId",auth, getUser);


module.exports = router;
