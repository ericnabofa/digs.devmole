import { useEffect, useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Separator } from "@/components/ui/Separator";
import { UserIcon } from '@/components/icons/UserIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer


export default function Home() {
    const [articles, setArticles] = useState([]);

    const announcements = [
        {
            id: 1,
            title:'New Article Coming soon',
            description: 'Stay tuned for our upcoming article on AI development.',
            date: '2024-09-22',
            image: '/images/announcement1.png'
        },

        {
            id: 2,
            title:'PHP LARAVEL Updates',
            description: 'Stunning Property management site for house owners and property agents curated on php laravel.',
            date: '2024-09-26',
            image: '/images/announcement2.png'
        },
        {
            id: 3,
            title:'C# DOTNET Highlights',
            description: 'Exciting online jobs board built on c# dotnet.',
            date: '2024-10-15',
            image: '/images/announcement3.png'
        }
    ]

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/articles');
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="flex flex-col min-h-[100dvh]">
            {/* Header */}
            <Header />

            {/* Main Section */}
            <main className="flex-1">
                <section className="bg-muted py-12 md:py-16 lg:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold mb-8">Popular Articles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                            {articles.map(article => (
                                <Card key={article.id}>
                                    <CardContent>
                                        <h3 className="text-xl font-bold mb-2">{article.name}</h3>
                                        <p className="text-muted-foreground mb-4">{article.description.slice(0,100)}...</p>
                                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            <span>{article.author_name}</span>

                                            <Separator orientation="vertical" className="mx-2" />
                                            <ClockIcon className="w-4 h-4 mr-1" />
                                            <span>{article.read_time} min read</span>
                                        </div>
                                        <Link href={`/articles/${article.id}`} className="inline-flex items-center text-primary hover
                                        :underline"> Read More
                                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Announcements */}
                <section className="bg-secondary py-8">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-2xl font-bold mb-6 text-white">Announcements</h2>
                        <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map(announcement => (
                                <Card key={announcement.id}>
                                    <img
                                    src={announcement.image}
                                    alt={announcement.title}
                                    className="w-full h-48 object-cover rounded-t-md"
                                    />
                                    <CardContent>
                                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                                        <p className="text-gray-700 mb-2">{announcement.description}</p>
                                        <span className="text-sm text-gray-500"> Date: {announcement.date}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}