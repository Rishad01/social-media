import express from 'express';
import Post from './models/Post.js';
import { jwtAuthMiddleware,generateToken } from "./jwt.js";

const router = express.Router();

// Create a post
router.post('/create', jwtAuthMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = new Post({
      content,
      authorId: req.user.id,
      authorUsername: req.user.username
    });

    const savedPost = await newPost.save();
    console.log(savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
});



// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'username').populate('likes', 'username').populate('comments.userId', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
});

// Update a post
router.put('/:id', jwtAuthMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.content = content;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error updating post', error: err.message });
  }
});

// Delete a post
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  console.log(req.user.id);
  try {
    const postId = req.params.id;

    // Find post by ID and delete
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (deletedPost.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err); // Improved error logging
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
});

router.post('/:id/like', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post is already liked by the user
    const isLiked = post.likes.some((like) => like.equals(userId));

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((like) => !like.equals(userId));
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/:id/comment', jwtAuthMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      text,
      userId: req.user.id,
      username: req.user.username
    };

    post.comments.push(comment);
    await post.save();

    res.json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
});


export default router;
