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
    const result = await pool.query(`select articles.id, articles.name, articles.description, articles.content, articles.read_time, articles.category_id, articles.created_at, authors.name as author_name
        from articles
        join authors on articles.author_id = authors.id`);
    return result.rows;
}

const getArticleById = async (article_id) => {
    const result = await pool.query(`
        select articles.id, articles.name, articles.description, articles.content, articles.read_time, articles.category_id, articles.created_at, authors.name as author_name
        from articles
        join authors on articles.author_id = authors.id
        where articles.id = $1`, [article_id]);
    return result.rows[0];
}

const getRelatedArticles = async (category_id, article_id) => {
    try {
        const result = await pool.query(
            `select articles.id, articles.name, articles.description, articles.content, articles.read_time, articles.category_id, articles.created_at, authors.name as author_name
        from articles
        join authors on articles.author_id = authors.id 
            where articles.category_id = $1 and articles.id != $2`,
            [category_id, article_id]);
        return result.rows;
    } catch (error){
        throw error;
    }
};

const getAllAuthors = async () => {
    const result = await pool.query(`select * from authors`);
    return result.rows;
}

const getAllCategories = async () => {
    const result = await pool.query(`select * from categories`);
    return result.rows;
}

module.exports = {createArticle, getAllArticles, getArticleById, getRelatedArticles, getAllAuthors, getAllCategories };

