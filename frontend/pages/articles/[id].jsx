// pages/articles/[id].jsx
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
  if (!user) {
    alert('You must be logged in to perform this action.');
    return null;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token is missing or expired. Please log in again.');
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
      // Fetch article
      axios
        .get(`http://localhost:5000/api/articles/${id}`)
        .then((response) => {
          setArticle(response.data);

          // Fetch related articles
          return axios.get(`http://localhost:5000/api/articles/related`, {
            params: { category_id: response.data.category_id, article_id: id },
          });
        })
        .then((response) => {
          setRelatedArticles(response.data);
        })
        .catch((error) => {
          console.error(
            'Error fetching article or related articles',
            error.stack || error.message || error
          );
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

  // Handle posting a new comment
  const handlePostComment = async () => {
    if (!user) {
      alert('Please log in to post a comment.');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }
  
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
  
    try {
      console.log('Posting comment with payload:', {
        articleId: id,
        content: newComment,
      });
  
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        {
          articleId: id,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Comment posted successfully:', response.data);
  
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error.response || error);
      alert('Failed to post comment.');
    }
  };
  
  

  // Handle editing a comment
  const handleEditComment = async (commentId) => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content: editedCommentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };
  

  // Handle liking/disliking the article
  const handleArticleLike = async (type) => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/likes/article/${id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticleLikes(response.data);
    } catch (error) {
      console.error('Error liking/disliking article:', error);
      alert('Failed to like/dislike article.');
    }
  };
  

  // Handle liking/disliking a comment
  const handleCommentLike = async (commentId, type) => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/likes/comment/${commentId}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the likes/dislikes count for the comment
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
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 py-12">
            {/* Display the main article */}
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
                {/* Article Like/Dislike Buttons */}
                <div className="flex items-center mb-4 space-x-4">
                  <button
                    className="flex items-center text-primary"
                    onClick={() => handleArticleLike('like')}
                  >
                    👍 Like ({articleLikes.likes || 0})
                  </button>
                  <button
                    className="flex items-center text-primary"
                    onClick={() => handleArticleLike('dislike')}
                  >
                    👎 Dislike ({articleLikes.dislikes || 0})
                  </button>
                </div>
                {/* Process and render the content with images */}
                <div className="prose">
                  {processContentForImages(article.content)}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Comments</h2>

              {/* New Comment Form */}
              {user ? (
                <div className="mb-6">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows="3"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button
                    className="mt-2 px-4 py-2 bg-primary text-white rounded"
                    onClick={handlePostComment}
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                <p>
                  Please{' '}
                  <Link href="/login" className="text-primary underline">
                log in
                  </Link>{' '}
                  to post a comment.
                </p>
              )}

              {/* Comments List */}
              {comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {comment.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      {/* Display comment content or edit form */}
                      {editingCommentId === comment.id ? (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            rows="2"
                            value={editedCommentContent}
                            onChange={(e) =>
                              setEditedCommentContent(e.target.value)
                            }
                          ></textarea>
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="px-4 py-2 bg-primary text-white rounded"
                              onClick={() => handleEditComment(comment.id)}
                            >
                              Save
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-300 text-black rounded"
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedCommentContent('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2">{comment.content}</p>
                      )}

                      {/* Comment Actions */}
                      <div className="flex items-center mt-2 space-x-4">
                        <button
                          className="text-primary"
                          onClick={() => handleCommentLike(comment.id, 'like')}
                        >
                          👍 Like ({comment.likes || 0})
                        </button>
                        <button
                          className="text-primary"
                          onClick={() =>
                            handleCommentLike(comment.id, 'dislike')
                          }
                        >
                          👎 Dislike ({comment.dislikes || 0})
                        </button>
                        {user && user.id === comment.user_id && (
                          <>
                            <button
                              className="text-primary"
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditedCommentContent(comment.content);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </section>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="py-12 md:py-16 lg:py-20 mt-12 bg-gray-100">
                <div className="container mx-auto px-4 md:px-6">
                  <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedArticles.map((related) => (
                      <Card key={related.id}>
                        {related.image_url && (
                          <img
                            src={related.image_url}
                            alt={related.name}
                            className="w-full h-48 object-cover rounded-t-md"
                          />
                        )}
                        <CardContent>
                          <h3 className="text-lg font-bold mb-2">
                            {related.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {related.description.slice(0, 100)}...
                          </p>
                          <div className="flex items-center text-muted-foreground text-sm mb-4">
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span>{related.author_name}</span>
                            <Separator orientation="vertical" className="mx-2" />
                            <ClockIcon className="w-4 h-4 mr-2" />
                            <span>{related.read_time} min read</span>
                          </div>
                          <Link href={`/articles/${related.id}`} className="inline-flex items-center text-primary hover:underline">
                              Read More
                              <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
