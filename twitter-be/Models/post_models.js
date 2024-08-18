const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    ref: "UserModel",
  },
  description: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
  comments: [
    {
      commentText: String,
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
    },
  ],
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
},{
    timestamps:true
}); 

const PostModel = mongoose.model("PostModel", postSchema);

module.exports = PostModel;
