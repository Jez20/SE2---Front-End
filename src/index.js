import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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
  createBrowserRouter,
  RouterProvider,
  Route,
}from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login/>,
  },
  {
    path: "/",
    element: <Index/>,
  },
  {
    path: "/Index",
    element: <Index/>,
  },
  {
    path: "/Borrow",
    element: <Borrow/>,
  },
  {
    path: "/Reservation",
    element: <Reservation/>,
  },
  {
    path: "/Return",
    element: <Return/>,
  },
  {
    path: "/Inventory",
    element: <Inventory/>,
  },
  {
    path: "/Users",
    element: <Users/>,
  },
  {
    path: "/Adduser",
    element: <Adduser/>,
  },
  {
    path: "/Userdashboard",
    element: <Userdashboard/>,
  },
  {
    path: "/Userreserve",
    element: <Userreserve/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
