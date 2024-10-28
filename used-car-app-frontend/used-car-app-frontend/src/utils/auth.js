// src/utils/auth.js
export const isLoggedIn = () => {
    return !!localStorage.getItem('token'); // Returns true if the token exists
};
