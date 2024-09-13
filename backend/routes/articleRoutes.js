const express = require('express');
const { postArticle } = require('../controllers/articleController');
const router = express.Router();


router.post('/articles', postArticle);

module.exports = router;