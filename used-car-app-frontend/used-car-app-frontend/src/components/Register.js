// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/users/register', {
                email,
                password,
                role
            });
            alert('Registration successful! Redirecting to login...');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Error registering user. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Register as:
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        >
                            <option value="BUYER">Buyer</option>
                            <option value="SELLER">Seller</option>
                            <option value="AGENT">Agent</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
