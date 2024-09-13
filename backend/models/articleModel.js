const pool = require('../config/db');

const createArticle = async (data) => {
    const { name, description, content, readTime, authorId, categoryId } = data;
    const result = await pool.query(
        `insert into articles (name, description, content, read_time, author_id, category_id)
        values ($1, $2, $3, $4, $5, $6) returning *`,
        [name, description, content, readTime, authorId, categoryId]
    );
    return result.rows[0];
};

const getAllArticles = async () => {
    const result = await pool.query(`select * from articles`);
    return result.rows;
}

module.exports = {createArticle, getAllArticles };

