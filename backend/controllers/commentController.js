// controllers/commentController.js
const {
    createComment,
    getCommentsByArticleId,
    updateComment,
    deleteComment,
  } = require('../models/commentModel');
  
  const postComment = async (req, res) => {
    const { articleId, content } = req.body;
    const userId = req.user.id;
  
    try {
      const comment = await createComment({ articleId, userId, content });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error posting comment', error });
    }
  };
  
  const fetchComments = async (req, res) => {
    const { articleId } = req.params;
  
    try {
      const comments = await getCommentsByArticleId(articleId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
    }
  };
  
  const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
  
    try {
      const comment = await updateComment({ commentId, userId, content });
      if (!comment) {
        return res.status(403).json({ message: 'Not authorized to edit this comment' });
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error editing comment', error });
    }
  };
  
  const removeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
  
    try {
      const comment = await deleteComment({ commentId, userId });
      if (!comment) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
      }
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  };
  
  module.exports = {
    postComment,
    fetchComments,
    editComment,
    removeComment,
  };
  