const mongoose = require("mongoose");

const UserTypeAuthorizationSchema = new mongoose.Schema({
  userType: { type: mongoose.Schema.Types.ObjectId, ref: "UserType", required: true },
  authorizedRoutes: [{ type: String, required: true }]
});
 
const UserTypeAuthorization = mongoose.model("UserTypeAuthorization", UserTypeAuthorizationSchema);
module.exports = UserTypeAuthorization;