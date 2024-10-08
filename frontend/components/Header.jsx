// components/Header.jsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          DevMole Articles
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="#">HTML/CSS</Link>
          <Link href="#">PHP/LARAVEL</Link>
          <Link href="#">C# DOTNET</Link>
          <Link href="#">JAVASCRIPT/REACT/NEXT</Link>
          <Link href="#">OTHERS</Link>
        </nav>
      </div>
    </header>
  );
}
