import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Constants'; // Importe do arquivo config.js
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Community() {
  const [repositories, setRepositories] = useState({items: [], total: 0}); // Estado para armazenar os repositórios
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const ITEMS_PER_PAGE = 50; // Número de itens por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o valor do campo de busca
 
  const navigate = useNavigate();

  const fetchRepositories = async (search = '') => {

    try {
      const response = await fetch(`${API_BASE_URL}/community/repository/?clone_url=${search}&`);

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
      <h1 className="text-center mb-4">Dataset: Shared Results or Insights from Our Study</h1>

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
                  <Link to={`/additionalData/repository/${repo.id}`} className="btn btn-primary btn-sm">
                    View Details
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
    </div>
  );
}

export default Community; // Adicione esta linha