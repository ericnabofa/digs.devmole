// components/Header.jsx
import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Import icons for menu toggle

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationLinks = [
        { name: 'HTML/CSS', href: '#' },
        { name: 'PHP/LARAVEL', href: '#' },
        { name: 'C# DOTNET', href: '#' },
        { name: 'JAVASCRIPT/REACT/NEXT', href: '#' },
        { name: 'OTHERS', href: '#' },
    ];

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
                    {navigationLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:underline"> {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <nav className="px-4 pt-2 pb-4 space-y-1">
                        {navigationLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="block px-2 py-1 text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded">
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
