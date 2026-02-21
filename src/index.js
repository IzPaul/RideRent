import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './Pages/Login.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VehicleListing from './Pages/VehicleListing.tsx';
import Register from './Pages/Register.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/vehicle-listing' element={<VehicleListing />} />
      <Route path='/register' element={<Register />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
