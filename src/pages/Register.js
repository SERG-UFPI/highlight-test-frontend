import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../Constants'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const navigate = useNavigate();
  
  
    const handleRegister = async (event) => {
      event.preventDefault(); // Impede o recarregamento da página
      setIsLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/crud/user/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, confirm_password, fullname, email }),
          });
         if (response.ok) {
            toast.success("Action performed successfully.");
            
            setTimeout(() => {
              navigate("/repositories");
            }, 2000);
          } else {
            // Lidar com erros de registro
            const errorData = await response.json();
            toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
            console.error("Could not complete the operation:", response.status, response.statusText);
            setIsLoading(false);
          }
  
      } catch (error) {
         // Lidar com erros de rede ou outros erros
         console.error(`An unexpected error occurred: ${error}.`);
         toast.error(`An unexpected error occurred.`);
         setIsLoading(false);
      }
  
  
    }
    // ... (resto do código do componente Register)
    return (
      <form onSubmit={handleRegister} className="container mt-5 p-4 border rounded shadow-sm">
        <ToastContainer />
        <h2 className="text-center mb-4">Register</h2>
        <div className="form-group mb-3">
          <label htmlFor="username" className="form-label">Username *</label>
          <input 
            required
            type="text" 
            className="form-control"
            id="username" 
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">Password *
            <span
              className="ms-2"
              style={{ fontSize: "0.95em" }}
              title="It must have at least 8 characters, including uppercase, lowercase, numbers, and special characters"
            >
              <i className="bi bi-info-circle"></i>
            </span>
          </label>
          <input 
            required
            type="password" 
            className="form-control" 
            id="password" 
            placeholder="Enter your password"                
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirm_password" className="form-label">Confirm Password *</label>
          <input
            required 
            type="password" 
            className="form-control" 
            id="confirm_password" 
            placeholder="Confirm your password"
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="fullname" className="form-label">Full name</label>
          <input 
            type="text" 
            className="form-control" 
            id="fullname" 
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email
            <span
              className="ms-2"
              style={{ fontSize: "0.95em" }}
              title="Please enter a valid email address"
            >
              <i className="bi bi-info-circle"></i>
            </span>
          </label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Adding...' : 'Register'}</button>
      </form>
    );
  }


  export default Register;