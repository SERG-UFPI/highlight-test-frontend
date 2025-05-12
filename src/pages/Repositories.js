import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewRepositoryModal from './NewRepositoryModal'; // Importe o componente do modal
import { API_BASE_URL } from '../Constants'; // Importe do arquivo config.js
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Repositories() {
  const [repositories, setRepositories] = useState({items: [], total: 0}); // Estado para armazenar os repositórios
  const [githubRepositories, setGithubRepositories] = useState([]); // Lista de repositórios do GitHub
  const [selectedRepo, setSelectedRepo] = useState(null); // Repositório selecionado
  const [showModal, setShowModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false); // Modal para repositórios do GitHub
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [user, setUser] = useState('');
  const ITEMS_PER_PAGE = 50; // Número de itens por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o valor do campo de busca
 
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crud/user/get_user/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data); // Alimenta o estado `user` com os dados do backend
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUser(); // Chama a função para buscar os dados do usuário
  }, []);

  const fetchRepositories = async (search = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
       // Redirecionar para login se não houver token
      // ...
      navigate('/login');
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crud/repository/?clone_url=${search}`, {
         headers: {
          'Authorization': `Bearer ${token}`,
         }
      });

      if (response.status === 401) {
        localStorage.removeItem('token'); // Exemplo: remover token do localStorage
        navigate('/login');
        return
      }

      if (response.status !== 200) {
        toast.error(`HTTP error! status: ${response.status}.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error(`Error fetching repositories.`);
                
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchGithubRepositories = async () => {
    const token = user.github_token;
    if (!token) {
      toast.error("GitHub token not found. Please log in with GitHub.");
      return;
    }

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setGithubRepositories(data);
      setShowGithubModal(true);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      toast.error("Failed to fetch GitHub repositories.");
    }
  };

  const handleImportFromGithub = () => {
    fetchGithubRepositories();
  };

  const handleSelectGithubRepo = (repo) => {    
    setSelectedRepo(repo); // Define o repositório selecionado
    setShowGithubModal(false); // Fecha o modal de repositórios do GitHub
    setShowModal(true); // Abre o modal de NewRepositoryModal
  };

  const handleSearch = () => {
    fetchRepositories(searchTerm); // Faz a requisição com o termo de busca
  };

  // Calcula os repositórios da página atual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentRepositories = repositories.items.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula o número total de páginas
  const totalPages = Math.ceil(repositories.total / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Atualiza a página atual
  };



  return (
    <div className="container mt-5">
      <ToastContainer />
      <h1 className="text-center mb-4">Repositories</h1>

      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by Clone URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Filter
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Default Branch</th>
            <th>Clone URL</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRepositories.map((repo) => (
            <tr key={repo.id}>
              <td>{repo.default_branch}</td>
              <td>
                <a href={repo.clone_url} target="_blank" rel="noopener noreferrer">
                  {repo.clone_url}
                </a>
              </td>
              <td>{new Date(repo.registration_date).toLocaleDateString()}</td>
              <td>
                <div className="d-flex flex-column gap-2">
                  <Link to={`/additional_data/repository/${repo.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                  <Link to={`/pipelines/repository/${repo.id}`} className="btn btn-secondary btn-sm">
                    View Pipelines
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                <button className="page-link">{index + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    
      <div className="text-center mt-4">
        <button onClick={() => setShowModal(true)} className="btn btn-success">
          New Repository
        </button>
        {user && user.github_user === true && (
          <button onClick={handleImportFromGithub} className="btn btn-info ms-2">
            Import from GitHub
          </button>
         )}
      </div>

      {showGithubModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select a GitHub Repository</h5>
                <button type="button" className="btn-close" onClick={() => setShowGithubModal(false)}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {githubRepositories.map((repo) => (
                    <li
                      key={repo.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => handleSelectGithubRepo(repo)}
                      style={{ cursor: "pointer" }}
                    >
                      {repo.name}
                      <span className="badge bg-primary rounded-pill">{repo.default_branch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}      

      {showModal && (
        <NewRepositoryModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          initialData={{
            cloneUrl: selectedRepo?.clone_url || "",
            defaultBranch: selectedRepo?.default_branch || "",
          }}
        />
      )}
    </div>
  );
}

export default Repositories; // Adicione esta linha