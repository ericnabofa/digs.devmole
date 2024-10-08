// components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <p className="text-sm">&copy; 2023 Articles. All rights reserved.</p>
        <nav className="flex items-center space-x-4">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}
