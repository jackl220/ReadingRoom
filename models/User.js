const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jwt-simple");

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    require: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true
  },
  email: { type: String, unique: true, lowercase: true },
  hash: String,
  salt: String,
  image: String
});

//On Save Hook, encrypt the password
//Before saving a model, run this function
UserSchema.pre("save", function(next) {
  //capture current user
  const user = this;

  //generate a salty pirate, lol
  // user.salt = crypto.randomBytes(16).toString("hex");
  //user.hash = crypto
  //.pbkdf2Sync(user.password, user.salt, 1000, 512, "sha512")
  //.toString("hex");

  next();
});
// create user salt and hashcakes from password
UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  var candidateHash = crypto
    .pbkdf2Sync(candidatePassword, this.salt, 10000, 512, "sha512")
    .toString("hex");
  if (!candidateHash) {
    const err = new Error("Failed Hash");
    callback(err, false);
  } else if (this.hash === candidateHash) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

UserSchema.methods.generateJWT = function() {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      sub: this._id,
      iat: timestamp,
      email: this.email
    },
    process.env.SUPER_JWT_SECRET
  );
};
UserSchema.methods.toJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};

UserSchema.methods.toProfileJSONfor = function(user) {
  return {
    username: this.username,
    image:
      this.image || "https//static.productionready.io/images/smiley-cyrus.jpg"
  };
};
//export for uses
var User = mongoose.model("User", UserSchema);
module.exports = User;
