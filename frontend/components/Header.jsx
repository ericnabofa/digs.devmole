import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { AuthContext } from '@/contexts/AuthContext';
import { UserIcon } from '@heroicons/react/solid';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { user, logout } = useContext(AuthContext); // Access the user from AuthContext
    console.log('User:', user); // Check if the user is defined

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
                {/* Logo */}
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
                <nav className="hidden lg:flex space-x-6 items-center">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/categories/${category.id}`} className="hover:underline">
                            {category.name}
                        </Link>
                    ))}

                    {/* Display user info if logged in */}
                    <nav className="hidden lg:flex space-x-6 items-center">
          {user ? (
            <div className="flex items-center space-x-2">
              <UserIcon className="h-6 w-6 text-primary-foreground" />
              <span className="text-primary-foreground font-medium">{user.username}</span>
              <button onClick={logout} className="text-primary-foreground hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
          )}
        </nav>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <nav className="px-4 pt-2 pb-4 space-y-1">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className="block px-2 py-1 text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
