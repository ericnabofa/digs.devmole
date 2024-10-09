// models/likeModel.js
const pool = require('../config/db');

const likeArticle = async ({ articleId, userId, type }) => {
  const result = await pool.query(
    `INSERT INTO article_likes (article_id, user_id, type)
     VALUES ($1, $2, $3)
     ON CONFLICT (article_id, user_id)
     DO UPDATE SET type = $3 RETURNING *`,
    [articleId, userId, type]
  );
  return result.rows[0];
};

const getArticleLikes = async (articleId) => {
  const result = await pool.query(
    `SELECT
       SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
       SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
     FROM article_likes
     WHERE article_id = $1`,
    [articleId]
  );
  return result.rows[0];
};

const likeComment = async ({ commentId, userId, type }) => {
  const result = await pool.query(
    `INSERT INTO comment_likes (comment_id, user_id, type)
     VALUES ($1, $2, $3)
     ON CONFLICT (comment_id, user_id)
     DO UPDATE SET type = $3 RETURNING *`,
    [commentId, userId, type]
  );
  return result.rows[0];
};

const getCommentLikes = async (commentId) => {
  const result = await pool.query(
    `SELECT
       SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
       SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
     FROM comment_likes
     WHERE comment_id = $1`,
    [commentId]
  );
  return result.rows[0];
};

module.exports = {
  likeArticle,
  getArticleLikes,
  likeComment,
  getCommentLikes,
};
