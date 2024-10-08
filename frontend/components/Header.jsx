// components/Header.jsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <header className="bg-primary text-primary-foreground shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    DevMole Articles
                </Link>
                {/* Mobile menu button */}
                <div className="lg:hidden">
                    <button
                        type="button"
                        className="text-primary-foreground focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <XIcon className="h-6 w-6" />
                        ) : (
                            <MenuIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
                {/* Navigation Links */}
                <nav className="hidden lg:flex space-x-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/categories/${category.id}`} className="hover:underline">
                            {category.name}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <nav className="px-4 pt-2 pb-4 space-y-1">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/categories/${category.id}`} className="block px-2 py-1 text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded">

                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
