const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: String,
  productId: String,
  subscriptionId: String,
  subscriptionStatus: String,
  customerId: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
