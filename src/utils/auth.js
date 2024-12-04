// auth.js
export const getToken = () => {
    return sessionStorage.getItem('token'); // Use sessionStorage
};

export const setToken = (token) => {
    sessionStorage.setItem('token', token); // Use sessionStorage
};

export const removeToken = () => {
    sessionStorage.removeItem('token'); // Use sessionStorage
};