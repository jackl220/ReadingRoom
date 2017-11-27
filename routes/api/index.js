const router = require("express").Router();
const articles = require("./articles");

router.use("./articles", articles);

module.exports = router;
