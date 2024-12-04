import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18
import { BrowserRouter } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot here
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);