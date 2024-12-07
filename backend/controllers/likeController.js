const pool = require('../config/db');

// Like content
exports.likeContent = async (req, res) => {
    const { contentType, contentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO likes (user_id, content_type, content_id, type)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, content_type, content_id)
             DO UPDATE SET type = $4 RETURNING *`,
            [userId, contentType, contentId, type]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error liking content:', error.message);
        res.status(500).json({ error: 'Failed to like content' });
    }
};


// Unlike content
exports.unlikeContent = async (req, res) => {
    const { contentType, contentId } = req.params;
    const userId = req.user.id;

    try {
        await pool.query(
            `DELETE FROM likes WHERE user_id = $1 AND content_type = $2 AND content_id = $3`,
            [userId, contentType, contentId]
        );
        res.json({ message: 'Content unliked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlike content' });
    }
};

// Get likes
exports.getLikes = async (req, res) => {
    const { contentType, contentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
                    SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
             FROM likes WHERE content_type = $1 AND content_id = $2`,
            [contentType, contentId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
};
