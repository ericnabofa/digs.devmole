// Add a comment
exports.createComment = async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
      const result = await pool.query(
          `INSERT INTO comments (article_id, user_id, content)
           VALUES ($1, $2, $3) RETURNING *`,
          [articleId, userId, content]
      );
      res.json(result.rows[0]);
  } catch (error) {
      res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
      const result = await pool.query(
          `INSERT INTO comments (parent_comment_id, user_id, content)
           VALUES ($1, $2, $3) RETURNING *`,
          [commentId, userId, content]
      );
      res.json(result.rows[0]);
  } catch (error) {
      res.status(500).json({ error: 'Failed to reply to comment' });
  }
};
