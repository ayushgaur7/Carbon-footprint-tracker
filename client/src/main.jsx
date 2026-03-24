// src/App.jsx
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Navbar from './components/common/Navbar';
import Achievements from './components/achievements/Achievements';
import Leaderboard from './components/leaderboard/Leaderboard';
import Layout from './Layout';
import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'element={<Layout/>}>
      <Route path ='' element={<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router ={router}/>
  </React.StrictMode>,
)