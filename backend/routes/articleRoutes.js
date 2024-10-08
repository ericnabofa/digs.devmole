const express = require('express');
const { postArticle, fetchArticles, fetchArticleById, fetchRelatedArticles, fetchAuthors, fetchCategories, fetchArticlesByCategoryId, fetchPopularArticles } = require('../controllers/articleController');
const router = express.Router();

// Always define more specific routes first before defining routes with dynamic parameters. This will ensure that /articles/related is matched before /articles/:id.
router.post('/articles', postArticle);
router.get('/articles', fetchArticles);
router.get('/articles/related', fetchRelatedArticles); 
router.get('/articles/popular', fetchPopularArticles);
router.get('/articles/category/:categoryId', fetchArticlesByCategoryId);
router.get('/articles/:id', fetchArticleById);
router.get('/authors', fetchAuthors);
router.get('/categories', fetchCategories);

module.exports = router;