import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg">
              <div className="card-body">
                {/* Título principal da página como h1 */}
                <h1 className="text-center mb-4 h2">Welcome to HighLight Test Code</h1>

                {/* Mensagem mais escaneável */}
                <p className="text-secondary text-center mb-3">
                  Analyze how test code co-evolves with production code across projects.
                </p>
                <ol className="text-secondary mx-auto" style={{maxWidth: 720}}>
                  <li> Measure synchronization between tests and production over time.</li>
                  <li> Get insights to improve testing practices, code quality, and maintainability.</li>
                  <li> Supports JavaScript, TypeScript, Java, Python, PHP, and C#.</li>
                </ol>

                {/* CTAs */}
                <div className="text-center mt-4">
                  <p className="text-secondary">
                    Would you like to start a session and explore your own repositories,
                    or see what the community is sharing?
                  </p>
                  <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap">
                    {/* Troque o Link condicionalmente se estiver logado */}
                    {localStorage.getItem('token') ? (
                      <Link to="/repositories" className="btn btn-primary">
                        Go to My Repositories
                      </Link>
                    ) : (
                      <Link to="/login" className="btn btn-outline-primary">
                        Explore My Repositories
                      </Link>
                    )}
                    <Link to="/community" className="btn btn-outline-secondary">
                      View Community
                    </Link>
                  </div>
                </div>

                <hr className="my-4" />
                  <div className="mt-3">
                    <h2 className="fw-bold h5">Video Presentation</h2>
                    <p className="text-secondary mb-3">
                      Watch a short presentation of the tool:
                    </p>

                    {/* Embed responsivo (Bootstrap 5) */}
                    <div className="ratio ratio-16x9">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/U29eEg_gXXM?rel=0&modestbranding=1"
                        title="Highlight Test Code - Presentation"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>

                    {/* Link de fallback */}
                    <p className="mt-2 mb-0">
                      Prefer to open on YouTube?{" "}
                      <a
                        href="https://www.youtube.com/watch?v=U29eEg_gXXM"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch the video
                      </a>
                      .
                    </p>
                  </div>

                <hr className="my-4" />
                <div className="mt-3">
                  <h5 className="fw-bold mt-4">Related Publications</h5>
                  <p className="mb-1">
                    <a id="1" href="http://dx.doi.org/10.1002/smr.70035" target="_blank" rel="noopener noreferrer">[1]</a>
                    &nbsp;Miranda, Charles, et al. "Test Co-Evolution in Software Projects: A Large-Scale Empirical Study."
                    <em> Journal of Software: Evolution and Process.</em> 37, 7 (2025), e70035.
                  </p>
                  <p className="mb-0">
                    <a id="2" href="https://zenodo.org/records/16756417" target="_blank" rel="noopener noreferrer">[2]</a>
                    &nbsp;Miranda, Charles, et al. "Highlight Test Code: Visualizing the Co-Evolution of Test and Production Code in Software Repositories."
                    <em> Simpósio Brasileiro de Engenharia de Software (2025).</em>
                  </p>
                </div>

                
                <hr className="my-4" />
                <div className="mt-3">
                  <h5 className="fw-bold">Project Repositories</h5>

                  <p>
                      If you would like to run the tool locally or contribute to its evolution, here are the project repositories:
                  </p>

                  <p className="mb-1">
                    <a href="https://github.com/SERG-UFPI/highlight-test-backend" target="_blank" rel="noopener noreferrer">
                      Backend
                    </a>
                  </p>
                  <p className="mb-0">
                    <a href="https://github.com/SERG-UFPI/highlight-test-frontend" target="_blank" rel="noopener noreferrer">
                      Frontend
                    </a>
                  </p>
                </div>

                <hr className="my-4" />
                <div className="mt-3">
                  <h5 className="fw-bold mt-4">Contact</h5>
                  <p className="mb-0">
                    If you have questions, feedback, or would like to collaborate, feel free to reach out by email: <br />
                    <a href="mailto:charlesmiranda@ufpi.edu.br">charlesmiranda@ufpi.edu.br</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Home;