const express = require('express');
const router = express.Router();
const {
    getPosts,
    getMyPosts,
    createPost,
    deletePost,
    toggleLike,
    addReply,
    editReply,
    deleteReply,
} = require('../controllers/communityController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/posts', optionalProtect, getPosts);
router.get('/my-posts', protect, getMyPosts);
router.post('/posts', protect, createPost);
router.delete('/posts/:id', protect, deletePost);
router.patch('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/replies', protect, addReply);
router.patch('/posts/:postId/replies/:replyId', protect, editReply);
router.delete('/posts/:postId/replies/:replyId', protect, deleteReply);

module.exports = router;
