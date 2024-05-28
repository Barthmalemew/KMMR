import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import CSS file for global styles
import App from './App'; // Import the main application component
import reportWebVitals from './reportWebVitals'; // Import utility function for reporting web vitals

// Render the main application component to the root element
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Report web vitals to analytics server for performance monitoring
reportWebVitals();
