import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Separator } from "@/components/ui/Separator";
import { UserIcon } from '@/components/icons/UserIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import parse from 'html-react-parser';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

// Regular expression to detect image URLs
const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;

// Function to process content and replace image URLs with <img> tags
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

export default function ArticleDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        if (id) {
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
                    console.error(
                        'Error fetching article or related articles',
                        error.stack || error.message || error
                    );
                });
        }
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }

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
                                {/* Process and render the content with images */}
                                <div className="prose">
                                    {processContentForImages(article.content)}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Articles Section */}
                        {relatedArticles.length > 0 && (
                            <section className="py-12 md:py-16 lg:py-20 mt-12 bg-gray-100">
                                <div className="container mx-auto px-4 md:px-6">
                                    <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {relatedArticles.map((related) => (
                                            <Card key={related.id}>
                                                <CardContent>
                                                    <h3 className="text-lg font-bold mb-2">{related.name}</h3>
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
                                                    <Link
                                                        href={`/articles/${related.id}`}
                                                        className="inline-flex items-center text-primary hover:underline"
                                                    >
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

            {/* Separator Above Footer */}
            <div className="border-t border-gray-300"></div>


            {/* Footer */}
            <Footer />
        </div>
    );
}
