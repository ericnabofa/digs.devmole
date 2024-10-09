// models/commentModel.js
const pool = require('../config/db');

const createComment = async ({ articleId, userId, content }) => {
  const result = await pool.query(
    `INSERT INTO comments (article_id, user_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [articleId, userId, content]
  );
  return result.rows[0];
};

const getCommentsByArticleId = async (articleId) => {
    const result = await pool.query(
      `SELECT comments.*, users.username,
        COALESCE(likes.likes, 0) AS likes,
        COALESCE(likes.dislikes, 0) AS dislikes
       FROM comments
       JOIN users ON comments.user_id = users.id
       LEFT JOIN (
         SELECT comment_id,
           SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
           SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
         FROM comment_likes
         GROUP BY comment_id
       ) likes ON comments.id = likes.comment_id
       WHERE article_id = $1
       ORDER BY comments.created_at ASC`,
      [articleId]
    );
    return result.rows;
  };
  

const updateComment = async ({ commentId, userId, content }) => {
  const result = await pool.query(
    `UPDATE comments SET content = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3 RETURNING *`,
    [content, commentId, userId]
  );
  return result.rows[0];
};

const deleteComment = async ({ commentId, userId }) => {
  const result = await pool.query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
    [commentId, userId]
  );
  return result.rows[0];
};

module.exports = {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
};
