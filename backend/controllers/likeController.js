// controllers/likeController.js
const {
    likeArticle,
    getArticleLikes,
    likeComment,
    getCommentLikes,
  } = require('../models/likeModel');
  
  const postArticleLike = async (req, res) => {
    const { articleId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;
  
    try {
      await likeArticle({ articleId, userId, type });
      const likes = await getArticleLikes(articleId);
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ message: 'Error liking article', error });
    }
  };
  
  const getArticleLikesCount = async (req, res) => {
    const { articleId } = req.params;
  
    try {
      const likes = await getArticleLikes(articleId);
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching article likes', error });
    }
  };
  
  const postCommentLike = async (req, res) => {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;
  
    try {
      await likeComment({ commentId, userId, type });
      const likes = await getCommentLikes(commentId);
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ message: 'Error liking comment', error });
    }
  };
  
  const getCommentLikesCount = async (req, res) => {
    const { commentId } = req.params;
  
    try {
      const likes = await getCommentLikes(commentId);
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comment likes', error });
    }
  };
  
  module.exports = {
    postArticleLike,
    getArticleLikesCount,
    postCommentLike,
    getCommentLikesCount,
  };
  