const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});