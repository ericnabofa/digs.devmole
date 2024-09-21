import { useEffect, useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Separator } from "@/components/ui/Separator";
import { UserIcon } from '@/components/icons/UserIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';


export default function Home() {
    const [articles, setArticles] = useState([]);

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
            <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
                <div className="container mx-auto flex items-center justify-between">
                   <Link href="/" className="text-xl font-bold">Articles</Link>
                   <nav className="flex items-center space-x-6">
                    <Link href="#">HTML/CSS</Link>
                    <Link href="#">PHP/LARAVEL</Link>
                    <Link href="#">C# DOTNET</Link>
                    <Link href="#">JAVASCRIPT/REACT/NEXT</Link>
                    <Link href="#">OTHERS</Link>
                    </nav> 
                </div>
            </header>

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
                                        <p className="text-muted-foreground mb-4">{article.content.slice(0,100)}...</p>
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
            </main>

            {/* Footer */}
            <footer className="bg-muted text-muted-foreground py-6">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <p className="text-sm">&copy; 2023 Articles. All rights reserved.</p>
                    <nav className="flex items-center space-x-4">
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                        <Link href="#">Contact Us</Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}