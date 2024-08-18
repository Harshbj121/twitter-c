const express = require("express");
const router = express.Router();
const varifiedToken = require("../Middleware/protected");
const PostModel = require("../Models/post_models");
const UserModel = require('../Models/user_models');

//to view all post of all user
router.get("/allposts", varifiedToken, (req, res) => {
  PostModel.find()
    .sort({ createdAt: -1 })
    .populate("author", "_id fullname profileImg username")
    .then((dbPosts) => {
      res.status(200).json({ dbPosts });
    })
    .catch((error) => {
      console.log(error);
    });
});

// to view my all posts
router.get("/profile/:id", varifiedToken, async (req, res) => {
  const _id = req.params.id;
  const user = await UserModel.findById(_id);
  const dobObj = new Date(user.dob);
  const month = dobObj.getMonth() + 1;
  const year = dobObj.getFullYear();
  const date = dobObj.getDate();
  const doB = date + '-' + month + '-' + year;
  PostModel.find({ author: _id })
    .sort({ createdAt: 1 })
    .populate("author", "_id fullname profileImg ")
    .then((dbPosts) => {
      res.status(200).json({ post: dbPosts, user:user, doB: doB });
    })
    .catch((error) => {
      console.log(error);
    });
});

// to delete a post
router.delete('/deletepost/:postId', varifiedToken, async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.postId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the current user is the author of the post
    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    // If authorized, delete the post
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// to check if the post is liked by useror not
router.get("/checklike/:postId", varifiedToken, (req, res) => {
  const userId = req.user._id; // Assuming req.user contains the authenticated user's details
  const postId = req.params.postId;

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      // Check if the user's ID is in the likes array of the post
      const isLiked = post.likes.includes(userId);

      res.status(200).json({ liked: isLiked });
    })
    .catch((error) => {
      console.error("Error checking like:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});


// to like a post
router.put("/like/:postId", varifiedToken, (req, res) => {
  PostModel.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true, //return and update record
    }
  )
    .populate("author", "_id fullname")
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error("Error updating post:", err);
      res.status(400).json({ error: "Could not update post" });
    });
});

// to dislike post
router.put("/unlike/:postId", varifiedToken, (req, res) => {
  PostModel.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true, //return and update record
    }
  )
    .populate("author", "_id fullname")
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error("Error unliking post:", error);
      res.status(400).json({ error: error.message });
    });
});

// to comment on a post
router.put("/comment", varifiedToken, (req, res) => {
  const comment = {
    commentText: req.body.commentText,
    commentedBy: req.user._id,
  };
  PostModel.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true, //return and update record
    }
  )
    .populate("comments.commentedBy", "_id fullname")
    .populate("author", "_id fullname")
    .exec()
    .then((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// to follow a user
router.put('/follow/:userId', varifiedToken, async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.user._id);
    const userToFollow = await UserModel.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// to unfollow a user
router.put('/unfollow/:userId', varifiedToken, async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.user._id);
    const userToUnfollow = await UserModel.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if not following
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
