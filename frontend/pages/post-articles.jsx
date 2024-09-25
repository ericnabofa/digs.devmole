import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from '@/components/ui/Card';
import { CardContent} from '@/components/ui/CardContent';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function PostArticle() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState(0);
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch authors and categories when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsResponse = await axios.get('http://localhost:5000/api/authors');
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories');
        setAuthors(authorsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching authors or categories:', error);
      }
    };
    fetchData();
  }, []);

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
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter article description"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter article content"
                      required
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
                      <option value="" disabled>Select an author</option>
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
                      <option value="" disabled>Select a category</option>
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
            <p className="text-sm text-gray-600">{description || 'Article description goes here...'}</p>
            <div className="mt-4">
              <p>{content || 'Article content will be displayed here...'}</p>
              <p className="text-sm mt-2 text-gray-500">
                Read Time: {readTime ? `${readTime} min` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Author: {authors.find(a => a.id === parseInt(authorId))?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Category: {categories.find(c => c.id === parseInt(categoryId))?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


