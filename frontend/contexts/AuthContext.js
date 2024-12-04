// contexts/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally, verify token and fetch user data
      axios
      .get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
}, []);


const login = async (token) => {
  localStorage.setItem('token', token);
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user); // Use data fetched from backend
  } catch (error) {
    console.error('Failed to fetch user:', error);
    localStorage.removeItem('token');
    setUser(null);
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
