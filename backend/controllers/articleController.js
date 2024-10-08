const { createArticle, getAllArticles, getArticleById, getRelatedArticles, getAllAuthors, getAllCategories, getArticlesByCategoryId, getPopularArticles } = require("../models/articleModel")

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
        res.status(500).json({ message: 'Error fetching articles', error: error.stack || error.message || error });
    }
}

const fetchArticleById = async (req, res) => {
    try {
        const article = await getArticleById(req.params.id);
        if(!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json(article);
    } catch (error){
        res.status(500).json({ message: 'Error fetching article', error: error.stack || error.message || error });
    }
}

const fetchPopularArticles= async (req, res) => {
    try {
      const idsParam = req.query.ids;
      if (!idsParam) {
        return res.status(400).json({ message: 'No IDs provided' });
      }
      const ids = idsParam.split(',').map((id) => parseInt(id));
      const articles = await getPopularArticles(ids);
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching articles by IDs',
        error: error.stack || error.message || error,
      });
    }
  };

const fetchRelatedArticles = async (req, res) => {
    const { category_id, article_id } = req.query;
    try {
        const relatedArticles = await getRelatedArticles(category_id, article_id);
        res.json(relatedArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching related articles', error: error.stack || error.message || error });
    } 
}

const fetchAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Authors', error: error.stack || error.message || error });
    }
}

const fetchCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message : 'Error fetching Categories', error: error.stack || error.message || error })
    }
}

const fetchArticlesByCategoryId = async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const articles = await getArticlesByCategoryId(categoryId);
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching articles by category',
        error: error.stack || error.message || error,
      });
    }
  };

module.exports = { postArticle, fetchArticles, fetchArticleById, fetchRelatedArticles, fetchAuthors, fetchCategories, fetchArticlesByCategoryId, fetchPopularArticles };