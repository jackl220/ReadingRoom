const router = require("express").Router();
const articles = require("./articles");
const users = require("./users");

router.use("/articles", articles);
router.use("/users", users);

module.exports = router;
