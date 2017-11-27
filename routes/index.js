const router = require("express").Router();
const api = require("./api");

/* GET home page. */
router.use("/api", api);

module.exports = router;
