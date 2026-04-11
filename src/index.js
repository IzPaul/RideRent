import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/index.css';
import reportWebVitals from './reportWebVitals';
import Login from './authentication feature/pages/Login.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VehicleListing from './vehicles feature/pages/VehicleListing.tsx';
import Register from './authentication feature/pages/Register.tsx';
import Profile from './profile feature/pages/Profile.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/vehicle-listing' element={<VehicleListing />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
