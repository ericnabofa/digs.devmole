import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Separator } from '@/components/ui/Separator';
import { UserIcon } from '@/components/icons/UserIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query; // categoryId
  const [articles, setArticles] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (id) {
      const fetchArticles = async () => {
        try {
          // Fetch articles by category
          const articlesResponse = await axios.get(
            `http://localhost:5000/api/articles/category/${id}`
          );
          setArticles(articlesResponse.data);

          // Fetch category name
          const categoryResponse = await axios.get(
            `http://localhost:5000/api/categories`
          );
          const category = categoryResponse.data.find(
            (cat) => cat.id === parseInt(id)
          );
          setCategoryName(category ? category.name : 'Category');
        } catch (error) {
          console.error('Error fetching articles or category:', error);
        }
      };
      fetchArticles();
    }
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8">{categoryName}</h2>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {articles.map((article) => (
                  <Card key={article.id}>
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.name}
                        className="w-full h-48 object-cover rounded-t-md"
                      />
                    )}
                    <CardContent>
                      <h3 className="text-xl font-bold mb-2">{article.name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {article.description.slice(0, 100)}...
                      </p>
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span>{article.author_name}</span>
                        <Separator orientation="vertical" className="mx-2" />
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{article.read_time} min read</span>
                      </div>
                      <Link
                        href={`/articles/${article.id}`}
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        Read More
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No articles found in this category.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
