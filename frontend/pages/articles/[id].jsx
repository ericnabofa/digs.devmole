import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthContext } from '@/contexts/AuthContext';
import { UserIcon } from '@/components/icons/UserIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Separator } from '@/components/ui/Separator';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Authentication token not found. Please log in again.');
    return null;
  }
  return token;
};

// Regular expression to detect image URLs
const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

// Function to process content and replace image URLs with <img> tags
const processContentForImages = (content) => {
  const options = {
    replace: (domNode) => {
      if (domNode.type === 'text') {
        const text = domNode.data;
        const parts = [];

        let lastIndex = 0;
        let match;

        while ((match = imageUrlRegex.exec(text)) !== null) {
          const { index } = match;
          if (index > lastIndex) {
            parts.push(text.slice(lastIndex, index));
          }
          parts.push(
            <img
              src={match[0]}
              alt="Image"
              className="max-w-full h-auto my-4"
              key={index}
            />
          );
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          parts.push(text.slice(lastIndex));
        }

        if (parts.length > 0) {
          return <>{parts}</>;
        }
      }
    },
  };

  return parse(content, options);
};

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
   const [articleLikes, setArticleLikes] = useState({ likes: 0, dislikes: 0 });

  useEffect(() => {
    if (id) {
      // Fetch article and related articles
      axios
        .get(`http://localhost:5000/api/articles/${id}`)
        .then((response) => {
          setArticle(response.data);
          return axios.get(`http://localhost:5000/api/articles/related`, {
            params: { category_id: response.data.category_id, article_id: id },
          });
        })
        .then((response) => {
          setRelatedArticles(response.data);
        })
        .catch((error) => {
          console.error('Error fetching article or related articles', error);
        });

      // Fetch comments
      axios
        .get(`http://localhost:5000/api/comments/${id}`)
        .then((response) => {
          setComments(response.data);
        })
        .catch((error) => {
          console.error('Error fetching comments', error);
        });

      // Fetch article likes
      axios
        .get(`http://localhost:5000/api/likes/article/${id}`)
        .then((response) => {
          setArticleLikes(response.data);
        })
        .catch((error) => {
          console.error('Error fetching article likes', error);
        });
    }
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  const handlePostComment = async () => {
    if (!user) {
      alert('Please log in to post a comment.');
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        { articleId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    }
  };

  const handleEditComment = async (commentId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content: editedCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  const handleArticleLike = async (type) => {
    const token = getAuthToken();
    if (!token) return;

    const originalLikes = { ...articleLikes };
    const updatedLikes = {
      ...originalLikes,
      likes: type === 'like' ? originalLikes.likes + 1 : originalLikes.likes,
      dislikes: type === 'dislike' ? originalLikes.dislikes + 1 : originalLikes.dislikes,
    };
    setArticleLikes(updatedLikes);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/likes/article/${id}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArticleLikes(response.data);
    } catch (error) {
      console.error('Error liking/disliking article:', error);
      alert('Failed to like/dislike article.');
      setArticleLikes(originalLikes);
    }
  };

  const handleCommentLike = async (commentId, type) => {
    const token = getAuthToken();
    if (!token) return;

    const originalComments = [...comments];
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            likes: type === 'like' ? comment.likes + 1 : comment.likes,
            dislikes: type === 'dislike' ? comment.dislikes + 1 : comment.dislikes,
          }
        : comment
    );
    setComments(updatedComments);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/likes/comment/${commentId}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: response.data.likes,
                dislikes: response.data.dislikes,
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking/disliking comment:', error);
      alert('Failed to like/dislike comment.');
      setComments(originalComments);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 py-12">
            <Card>
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.name}
                  className="w-full h-64 object-cover rounded-t-md"
                />
              )}
              <CardContent>
                <h1 className="text-3xl font-bold mb-4">{article.name}</h1>
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>{article.author_name}</span>
                  <Separator orientation="vertical" className="mx-2" />
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>{article.read_time} min read</span>
                </div>
                <div className="flex items-center mb-4 space-x-4">
                  <button
                    onClick={() => handleArticleLike('like')}
                    className="text-primary"
                  >
                    👍 {articleLikes.likes}
                  </button>
                  <button
                    onClick={() => handleArticleLike('dislike')}
                    className="text-danger"
                  >
                    👎 {articleLikes.dislikes}
                  </button>
                </div>

                <div className="mt-6">{processContentForImages(article.content)}</div>
              </CardContent>
            </Card>

            <section className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>

              {/* Comments Section */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-6 h-6" />
                      <span className="font-semibold">{comment.author_name}</span>
                    </div>
                    <div>{comment.content}</div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment.id, 'like')}
                        className="text-primary"
                      >
                        👍 {comment.likes}
                      </button>
                      <button
                        onClick={() => handleCommentLike(comment.id, 'dislike')}
                        className="text-danger"
                      >
                        👎 {comment.dislikes}
                      </button>

                      {/* Show Edit and Delete buttons only if the user is the author of the comment */}
                      {user?.id === comment.user_id && (
                        <div className="space-x-4">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditedCommentContent(comment.content);
                            }}
                            className="text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-danger"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit comment form */}
                    {editingCommentId === comment.id && (
                      <div className="mt-4">
                        <textarea
                          className="w-full p-2 border rounded"
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                        />
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="text-primary"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-danger"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* New Comment */}
              <div className="mt-6">
                <textarea
                  className="w-full p-2 border rounded"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={handlePostComment}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
