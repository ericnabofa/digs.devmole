// models/likeModel.js
const pool = require('../config/db');

// Function to like or dislike an article or comment
const likeContent = async ({ userId, contentType, contentId, type }) => {
  try {
    // Insert or update like/dislike based on the content type (article or comment)
    const result = await pool.query(
      `INSERT INTO likes (user_id, content_type, content_id, type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, content_type, content_id)
       DO UPDATE SET type = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, contentType, contentId, type]
    );
    return result.rows[0]; // Return the inserted/updated like record
  } catch (error) {
    console.error('Error liking content:', error);
    throw error;
  }
};

// Get like/dislike counts for article or comment
const getContentLikes = async ({ contentType, contentId }) => {
  try {
    const result = await pool.query(
      `SELECT
         SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
         SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
       FROM likes
       WHERE content_type = $1 AND content_id = $2`,
      [contentType, contentId]
    );
    return result.rows[0]; // Return the like/dislike counts
  } catch (error) {
    console.error('Error fetching content likes:', error);
    throw error;
  }
};

module.exports = {
  likeContent,
  getContentLikes,
};
