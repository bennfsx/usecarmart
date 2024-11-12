import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Sending login request to the backend
      const response = await axios.post('http://127.0.0.1:8000/login', {
        email,
        password
      });

      // On successful login, store the token in localStorage
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Decode JWT to extract user information (you can use jwt-decode library for this)
      const decodedToken = decodeJWT(token); // Assuming decodeJWT is a function to decode the JWT
      const buyerId = decodedToken.buyerId;

      // Store buyerId (could use state management like Context API or directly in localStorage)
      localStorage.setItem('buyerId', buyerId);
      
      // Redirect to the appropriate page based on the user's role
      // You could check the role from the decoded token to navigate the user accordingly
      if (decodedToken.role === 'buyer') {
        navigate('/');
        window.location.reload()
      } else if (decodedToken.role === 'seller') {
        navigate('/');
        window.location.reload()
      } else {
        navigate('/');
        window.location.reload()
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // Function to decode JWT token (you can install jwt-decode library or decode manually)
  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md">Login</button>
      </form>
    </div>
  );
};

export default Login;
