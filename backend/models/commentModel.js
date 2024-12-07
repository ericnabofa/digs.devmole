// models/commentModel.js
const pool = require('../config/db');

// Create a new comment
const createComment = async ({ articleId, userId, content }) => {
  try {
    const result = await pool.query(
      `INSERT INTO comments (article_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [articleId, userId, content]
    );
    return result.rows[0]; // Return the created comment
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Get comments for a specific article, including likes and dislikes for each comment
const getCommentsByArticleId = async (articleId) => {
  try {
    const result = await pool.query(
      `SELECT comments.*, users.username,
         COALESCE(likes.likes, 0) AS likes,
         COALESCE(likes.dislikes, 0) AS dislikes
       FROM comments
       JOIN users ON comments.user_id = users.id
       LEFT JOIN (
         SELECT content_id,
           SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
           SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
         FROM likes
         WHERE content_type = 'comment'
         GROUP BY content_id
       ) likes ON comments.id = likes.content_id
       WHERE article_id = $1
       ORDER BY comments.created_at ASC`,
      [articleId]
    );
    return result.rows; // Return the comments with like/dislike counts
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Update a comment
const updateComment = async ({ commentId, userId, content }) => {
  try {
    const result = await pool.query(
      `UPDATE comments SET content = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [content, commentId, userId]
    );
    return result.rows[0]; // Return the updated comment
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Delete a comment
const deleteComment = async ({ commentId, userId }) => {
  try {
    const result = await pool.query(
      `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
      [commentId, userId]
    );
    return result.rows[0]; // Return the deleted comment
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

module.exports = {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
};
