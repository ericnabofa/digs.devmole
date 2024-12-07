const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Correct import path
const { createComment, replyToComment } = require('../controllers/commentController');
const router = express.Router();

// Add a comment on an article
router.post('/:articleId/comment', authMiddleware, createComment);

// Reply to a comment
router.post('/:commentId/reply', authMiddleware, replyToComment);

module.exports = router;
