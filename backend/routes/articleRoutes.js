const express = require('express');
const { postArticle, fetchArticles, fetchArticleById } = require('../controllers/articleController');
const router = express.Router();


router.post('/articles', postArticle);
router.get('/articles', fetchArticles);
router.get('/articles/:id', fetchArticleById);

module.exports = router;