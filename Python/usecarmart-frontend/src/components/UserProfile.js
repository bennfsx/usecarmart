import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '', // Changed this to 'phone_number'
    address: '',
    password: '', // Add password field
    currentPassword: '', // Added currentPassword for password update
    newPassword: '' // Added newPassword for password update
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false); // New state for password editing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Token is missing. Please log in.");
        return; // Early return if token is missing
      }

      try {
        // Decode the token to get userId from the payload
        const decodedToken = jwtDecode(token); // Correct usage of jwt-decode
        const userId = decodedToken.id; // Assuming the userId is stored in the 'id' field in the token
        
        console.log("Decoded userId from token:", userId); // Debugging line

        if (!userId) {
          setError("User ID is missing in the token.");
          return; // Early return if userId is not found in the token
        }

        setLoading(true);
        setError(null);

        // Fetch user data using userId
        const response = await axios.get(`http://localhost:8000/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token); // Correct usage of jwt-decode
    const userId = decodedToken.id; // Extract userId from token

    try {
      await axios.put(`http://localhost:8000/profile/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token); // Correct usage of jwt-decode
    const userId = decodedToken.id; // Extract userId from token
    
    console.log("Current password:", userData.currentPassword);
    console.log("New password:", userData.newPassword);
  
    try {
      // Sending both current_password and new_password in the request body
      await axios.put(
        `http://localhost:8000/profile/${userId}/password`, 
        {
          current_password: userData.currentPassword, // Assuming you have currentPassword in userData
          new_password: userData.newPassword,          // Assuming you have newPassword in userData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Password updated successfully!");
      setIsPasswordEditing(false);
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              name="phone_number" // Changed this to 'phone_number'
              value={userData.phone_number} // Changed to 'phone_number'
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>

          {isPasswordEditing && (
            <div>
              <div>
                <label className="block font-medium">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={userData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-6">
        {isPasswordEditing ? (
          <button
            onClick={handlePasswordChange}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Change Password
          </button>
        ) : (
          <button
            onClick={() => setIsPasswordEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        )}
        {isPasswordEditing && (
          <button
            onClick={() => setIsPasswordEditing(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
