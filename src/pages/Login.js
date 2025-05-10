import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../Constants'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
  
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search); 
    const token = queryParams.get('token'); 
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleIntegrationLogin = async (event) => {
      setIsLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/auth/login_by_token/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
         if (response.ok) {
  
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
  
            toast.success("Action performed successfully.");
            navigate("/repositories")
          } else {
            // Lidar com erros de registro
            const errorData = await response.json();
            toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
            console.error("Could not complete the operation:", response.status, response.statusText);
            setIsLoading(false);
          }
  
      } catch (error) {
         // Lidar com erros de rede ou outros erros
         toast.error(`An unexpected error occurred: ${error}.`);
         setIsLoading(false);
      }
  
    }
  
    const handleLogin = async (event) => {
      event.preventDefault(); // Impede o recarregamento da página
      setIsLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/auth/token/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });
         if (response.ok) {
  
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
  
            toast.success("Action performed successfully.");
            navigate("/repositories")
          } else {
            // Lidar com erros de registro
            const errorData = await response.json();
            toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
            console.error("Could not complete the operation:", response.status, response.statusText);
            setIsLoading(false);
          }
  
      } catch (error) {
         // Lidar com erros de rede ou outros erros
         toast.error(`An unexpected error occurred: ${error}.`);
         setIsLoading(false);
      }
  
    }
  
    useEffect(() => {
      if (token) {
        handleIntegrationLogin();
      }
    }, [token]);
    
    const handleGitHubLogin = () => {
      window.location.href = `${API_BASE_URL}/auth/github`; // URL do backend para iniciar o OAuth com GitHub
    };
    
    return (
      <div className="container d-flex justify-content-center align-items-center">
          <ToastContainer />
          
          <div className="card shadow-lg mt-5 p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="nickName" className="form-label">Username *</label>
                  <input 
                    required
                    type="text" 
                    className="form-control"
                    id="nickName" 
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password *</label>
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
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Processing...' : 'Sign in'}</button>
              </form>
              <div className="text-center mt-3">
                <small className="text-muted">Forgot your password? Contact the site admin.</small>
              </div>
              <div className="text-center my-3">
                <span className="text-muted">OR</span>
              </div>
              <button onClick={handleGitHubLogin} className="btn btn-dark w-100">
                Login with GitHub
              </button>
              <div className="text-center mt-3">
                <small className="text-muted">
                  Don't have an account? <Link to="/register">Sign up</Link>.
                </small>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
export default Login;