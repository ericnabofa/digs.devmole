const { createArticle } = require("../models/articleModel")

const postArticle = async (req, res) => {
    try {
        const article = await createArticle(req.body);
        res.status(201).json(article);
    } catch(error) {
        console.error('Error posting article:', error);
        res.status(500).json({ message: 'Error posting article', error: error.stack || error.message || error });
    }
};

module.exports = { postArticle };