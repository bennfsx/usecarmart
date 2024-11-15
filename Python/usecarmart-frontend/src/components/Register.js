import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // For success modal
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', { email, password, role });
      console.log("STATUS", response.status);

      if (response.data[0].message === "User registered successfully!") {
        setError(''); // Clear any previous errors
        setShowSuccessModal(true); // Show success modal on successful registration
      } else {
        setError(response.data[0].message); // Display the error message from server
      }
    } catch (err) {
      setError('Registration failed. Please try again later.');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false); // Close the success modal
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Create an User Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Select Role</label>
            <select 
              id="role"
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Register
          </button>
        </form>

    
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-green-500 mb-4">Registration Successful!</h3>
            <p className="text-gray-700 mb-4">User account has been successfully created.</p>
            <button 
              onClick={handleModalClose} 
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
