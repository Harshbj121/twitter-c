const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  location: {
    type: String
  },
  dob: {
    type: Date,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique : true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1720264715417-eee343d0d756?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
},{
  timestamps:true
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
