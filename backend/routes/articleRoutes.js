const express = require('express');
const { postArticle, fetchArticles, fetchArticleById, fetchRelatedArticles } = require('../controllers/articleController');
const router = express.Router();


router.post('/articles', postArticle);
router.get('/articles', fetchArticles);
router.get('/articles/:id', fetchArticleById);
router.get('/articles/related', fetchRelatedArticles);

module.exports = router;