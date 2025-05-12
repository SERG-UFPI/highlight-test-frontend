import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import './App.css';
import Repositories from './pages/Repositories'; 
import Community from './pages/Community'; 
import RepositoryDetails from './pages/RepositoryDetails';
import Pipelines from './pages/Pipelines';
import PipelineDetails from './pages/PipelineDetails';
import { API_BASE_URL } from './Constants'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/additional_data/repository/:repository_id" element={<RepositoryDetails />} />
          <Route path="/pipelines/repository/:repository_id" element={<Pipelines />} />          
          <Route path="/pipelines/:id" element={<PipelineDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;