const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("slug");

const ArticleSchema = new Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },

  { timestamps: true }
);
ArticleSchema.pre("validate", function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

ArticleSchema.methods.slugify = function() {
  this.slug =
    slug(this.title) +
    "_" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

ArticleSchema.methods.toJSONFor = function(user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user)
  };
};

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
