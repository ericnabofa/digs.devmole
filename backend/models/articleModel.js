const pool = require('../config/db');

const createArticle = async (data) => {
  const { name, description, content, readTime, authorId, categoryId, imageUrl } = data;
  const result = await pool.query(
    `INSERT INTO articles (name, description, content, read_time, author_id, category_id, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, content, readTime, authorId, categoryId, imageUrl]
  );
  return result.rows[0];
};

const getAllArticles = async () => {
  const result = await pool.query(`
    SELECT articles.id, articles.name, articles.description, articles.content, articles.read_time,
           articles.category_id, articles.image_url, articles.created_at, authors.name AS author_name
    FROM articles
    JOIN authors ON articles.author_id = authors.id
  `);
  return result.rows;
};

const getArticleById = async (article_id) => {
    const result = await pool.query(`
      SELECT articles.id, articles.name, articles.description, articles.content, articles.read_time,
             articles.category_id, articles.image_url, articles.created_at, authors.name AS author_name,
             categories.name AS category_name
      FROM articles
      JOIN authors ON articles.author_id = authors.id
      JOIN categories ON articles.category_id = categories.id
      WHERE articles.id = $1
    `, [article_id]);
    return result.rows[0];
  };

  const getPopularArticles = async (ids) => {
    const result = await pool.query(
      `
      SELECT articles.id, articles.name, articles.description, articles.content, articles.read_time,
             articles.category_id, articles.image_url, articles.created_at, authors.name AS author_name
      FROM articles
      JOIN authors ON articles.author_id = authors.id
      WHERE articles.id = ANY($1::int[])
      `,
      [ids]
    );
    return result.rows;
  };

const getRelatedArticles = async (category_id, article_id) => {
  try {
    const result = await pool.query(`
      SELECT articles.id, articles.name, articles.description, articles.content, articles.read_time,
             articles.category_id, articles.image_url, articles.created_at, authors.name AS author_name
      FROM articles
      JOIN authors ON articles.author_id = authors.id
      WHERE articles.category_id = $1 AND articles.id != $2
    `, [category_id, article_id]);
    return result.rows;
  } catch (error) {
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

const getArticlesByCategoryId = async (categoryId) => {
    const result = await pool.query(`
      SELECT articles.id, articles.name, articles.description, articles.content, articles.read_time,
             articles.category_id, articles.image_url, articles.created_at, authors.name AS author_name
      FROM articles
      JOIN authors ON articles.author_id = authors.id
      WHERE articles.category_id = $1
      ORDER BY articles.created_at DESC
    `, [categoryId]);
    return result.rows;
  };

module.exports = {createArticle, getAllArticles, getArticleById, getRelatedArticles, getAllAuthors, getAllCategories, getArticlesByCategoryId, getPopularArticles };

