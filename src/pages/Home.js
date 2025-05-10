import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-body">
                <h2 className="text-center mb-4">Welcome to HighLight Test Code</h2>
                <p className="text-muted text-center">
                  The Highlight Test Code is designed to help software development teams analyze the synchronization (or co-evolution) between test code and production code across various software projects.
                </p>
                <p className="text-muted text-center">
                  This tool provides insights into how often test code evolves alongside the production code, offering valuable feedback to improve testing practices, code quality, and maintainability. It is specifically designed for projects developed in JavaScript, TypeScript, Java, Python, PHP, and C#.
                </p>
                <div className="text-center mt-4">
                <p className="text-muted">
                  Would you like to start a session and explore your own repositories, 
                  or see what the community is sharing?
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-outline-primary">
                    Explore My Repositories
                  </Link>
                  <Link to="/community" className="btn btn-outline-secondary">
                    View Community
                  </Link>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Home;