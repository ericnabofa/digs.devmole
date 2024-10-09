// pages/register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      // Save token and user data (consider using context or state management)
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      // Redirect to home or profile page
      router.push('/');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="username" className="block font-semibold">Username</label>
          <input
            id="username"
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-semibold">Password</label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
