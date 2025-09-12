const router = require("express").Router()

router.get("/", () => console.log("get users") );
router.get("/:userId", () => console.log("get users id") );
router.post("/", () => console.log("post users") );

module.exports = router;