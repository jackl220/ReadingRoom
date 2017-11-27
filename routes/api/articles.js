const articleRouter = require("express").Router();
const Article = require("../../models/Article");

articleRouter.route("/").get(function(req, res, next) {
  Article.find({})
    .limit(10)
    .sort({ createdAt: "desc" })
    .exec(function(err, payload) {
      if (err) {
        next(err);
      } else {
        res.send(payload);
      }
    });
});
module.exports = articleRouter;
