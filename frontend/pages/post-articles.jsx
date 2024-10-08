import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import parse from 'html-react-parser';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Define a toolbar
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
  ],
};

// Regular expression to detect image URLs
const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;

export default function PostArticle() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch authors and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsResponse = await axios.get(
          'http://localhost:5000/api/authors'
        );
        const categoriesResponse = await axios.get(
          'http://localhost:5000/api/categories'
        );
        setAuthors(authorsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching authors or categories:', error);
      }
    };
    fetchData();
  }, []);

  // Process content to replace image URLs
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/articles', {
        name,
        description,
        content,
        readTime,
        authorId,
        categoryId,
      });
      if (response.status === 201) {
        alert('Article posted successfully');
        // Reset form fields
        setName('');
        setDescription('');
        setContent('');
        setReadTime('');
        setAuthorId('');
        setCategoryId('');
      }
    } catch (error) {
      console.error('Error posting article:', error);
      alert('Failed to post the article');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Article</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter article title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter article description"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <ReactQuill
                        value={content}
                        onChange={setContent}
                        placeholder="Enter article content"
                        modules={modules}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="authorId">Author</Label>
                        <select
                          id="authorId"
                          value={authorId}
                          onChange={(e) => setAuthorId(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-md p-2"
                        >
                          <option value="" disabled>
                            Select an author
                          </option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="categoryId">Category</Label>
                        <select
                          id="categoryId"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-md p-2"
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="readTime">Read Time (in minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="Enter read time"
                        required
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit">Publish</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Preview Section */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <Card className="bg-gray-50">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">Article Preview</h2>
                <div>
                  <h3 className="text-2xl font-bold">
                    {name || 'Article Title'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {description || 'Article description goes here...'}
                  </p>
                  <div className="prose">
                    {content ? processContentForImages(content) : (
                      <p>Article content will be displayed here...</p>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      <strong>Read Time:</strong>{' '}
                      {readTime ? `${readTime} min` : 'N/A'}
                    </p>
                    <p>
                      <strong>Author:</strong>{' '}
                      {authors.find((a) => a.id === parseInt(authorId))?.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Category:</strong>{' '}
                      {categories.find((c) => c.id === parseInt(categoryId))?.name || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
