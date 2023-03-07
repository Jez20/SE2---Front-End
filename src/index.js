import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Borrow from './components/Borrow';
import Return from './components/Return';
import Inventory from './components/Inventory';
import Users from './components/Users';
import Reservation from './components/Reservation';
import Userdashboard from './components/Userdashboard';
import Userreserve from './components/Userreserve';
import Adduser from './components/Adduser';
import Login from './components/Login';
import Index from './components/Index';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Index" element={<Index />} />
      <Route path="/Borrow" element={<Borrow />} />
      <Route path="/Reservation" element={<Reservation />} />
      <Route path="/Return" element={<Return />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/Adduser" element={<Adduser />} />
      <Route path="/Userdashboard" element={<Userdashboard />} />
      <Route path="/Userreserve" element={<Userreserve />} />
    </Routes>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);