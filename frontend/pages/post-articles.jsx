import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import Next.js dynamic
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import parse from 'html-react-parser';

// Dynamically import ReactQuill to only load it on the client-side
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles only on the client side

// Define a toolbar
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
  ],
};

// Regular expression to detect image URLs
const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

export default function PostArticle() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(''); // Store content as HTML
  const [readTime, setReadTime] = useState(0);
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch authors and categories when the component loads
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

  // Updated function to process HTML content and replace image URLs
  const processContentForImages = (content) => {
    const options = {
      replace: (domNode) => {
        if (domNode.type === 'text') {
          const text = domNode.data;
          const parts = [];

          let lastIndex = 0;
          let match;

          // Use the regex to find all image URLs in the text node
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
        content, // Send raw content including any image URLs
        readTime,
        authorId,
        categoryId,
      });
      if (response.status === 201) {
        alert('Article posted successfully');
      }
    } catch (error) {
      console.error('Error posting article:', error);
      alert('Failed to post the article');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex space-x-8">
        {/* Form Section */}
        <div className="w-2/3">
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
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
                    {/* Quill Rich Text Editor */}
                    <ReactQuill
                      value={content}
                      onChange={setContent}
                      placeholder="Enter article content"
                      modules={modules}
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorId">Author</Label>
                    <select
                      id="authorId"
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      required
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

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button type="submit">Publish</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Preview Section */}
        <div className="w-1/3 bg-gray-100 p-4">
          <h2 className="text-xl font-semibold mb-4">Article Preview</h2>
          <div>
            <h3 className="text-lg font-bold">{name || 'Article Title'}</h3>
            <p className="text-sm text-gray-600">
              {description || 'Article description goes here...'}
            </p>
            <div className="mt-4">
              {/* Render the processed content */}
              {processContentForImages(content) || (
                <p>Article content will be displayed here...</p>
              )}
              <p className="text-sm mt-2 text-gray-500">
                Read Time: {readTime ? `${readTime} min` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Author:{' '}
                {authors.find((a) => a.id === parseInt(authorId))?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Category:{' '}
                {categories.find((c) => c.id === parseInt(categoryId))?.name ||
                  'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
