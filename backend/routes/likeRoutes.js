// // routes/likeRoutes.js
// const express = require('express');
// const { authenticate } = require('../middleware/authMiddleware');
// const {
//   postArticleLike,
//   getArticleLikesCount,
//   postCommentLike,
//   getCommentLikesCount,
// } = require('../controllers/likeController');

// const router = express.Router();

// // Article Likes
// router.post('/article/:articleId', authenticate, postArticleLike);
// router.get('/article/:articleId', getArticleLikesCount);

// // Comment Likes
// router.post('/comment/:commentId', authenticate, postCommentLike);
// router.get('/comment/:commentId', getCommentLikesCount);

// module.exports = router;
