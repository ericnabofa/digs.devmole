const express = require('express');
const { postArticle, fetchArticles } = require('../controllers/articleController');
const router = express.Router();


router.post('/articles', postArticle);
router.get('/articles', fetchArticles)

module.exports = router;