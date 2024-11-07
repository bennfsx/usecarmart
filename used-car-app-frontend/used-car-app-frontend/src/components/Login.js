// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/users/login', {
                email,
                password,
            });

            // Adjust the response based on your backend implementation
            // Assuming your backend sends a token as { token: "your_token_here" }
            console.log('Response data:', response.data);
            const token = response.data; // Use this if response.data is the token string
            localStorage.setItem('token', token); // Store the token in local storage

            alert('Login successful! Redirecting to home...');
            navigate('/home'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-indigo-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
