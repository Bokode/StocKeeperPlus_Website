
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import './index.css';

function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Dashboard />} /> 

      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>,
);