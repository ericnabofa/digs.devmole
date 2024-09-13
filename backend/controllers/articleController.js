const { createArticle, getAllArticles } = require("../models/articleModel")

const postArticle = async (req, res) => {
    try {
        const article = await createArticle(req.body);
        res.status(201).json(article);
    } catch(error) {
        res.status(500).json({ message: 'Error posting article', error: error.stack || error.message || error });
    }
};

const fetchArticles = async (req, res ) => {
    try {
        const articles = await getAllArticles();
        res.status(200).json(articles)
    } catch (error) {
        res.status(500).json({ message: 'Error posting article', error: error.stack || error.message || error })
    }
}

module.exports = { postArticle, fetchArticles };