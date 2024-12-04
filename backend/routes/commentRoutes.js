// // routes/commentRoutes.js
// const express = require('express');
// const { authenticate } = require('../middleware/authMiddleware');
// const {
//   postComment,
//   fetchComments,
//   editComment,
//   removeComment,
// } = require('../controllers/commentController');

// const router = express.Router();

// // Post a comment
// router.post('/', authenticate, postComment);

// // Get comments for an article
// router.get('/:articleId', fetchComments);

// // Edit a comment
// router.put('/:commentId', authenticate, editComment);

// // Delete a comment
// router.delete('/:commentId', authenticate, removeComment);

// module.exports = router;

