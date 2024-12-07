const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Correct import path
const { likeContent, unlikeContent, getLikes } = require('../controllers/likeController');
const router = express.Router();

// Like content (article or comment)
router.post('/:contentType/:contentId', authMiddleware, likeContent);

// Unlike content
router.delete('/:contentType/:contentId', authMiddleware, unlikeContent);

// Get likes for specific content
router.get('/:contentType/:contentId', getLikes);

module.exports = router;
