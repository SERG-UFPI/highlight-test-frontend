import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement } from 'chart.js';
import { Doughnut, Line, Bar, Scatter } from 'react-chartjs-2';
import { Table } from 'react-bootstrap';
import { API_BASE_URL } from '../Constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Modal from 'react-modal'; // Certifique-se de que o react-modal está instalado

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement);

function PipelineDetails() {
  const { id } = useParams();
  const [pipeline, setPipeline] = useState([]);
  const [repository, setRepository] = useState([]);
  const [indicator1, setIndicator1] = useState(null);
  const [indicator2, setIndicator2] = useState(null);
  const [indicator3, setIndicator3] = useState(null);
  const [indicator4, setIndicator4] = useState(null);
  const [indicator5, setIndicator5] = useState(null);
  const [indicator6, setIndicator6] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento do botão
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar o modal
  const [modalData, setModalData] = useState([]); // Dados para a tabela no modal
  const [currentPage, setCurrentPage] = useState(1); // Página atual da tabela
  const [filter, setFilter] = useState('all'); // Estado para o filtro
  const ITEMS_PER_PAGE = 10; // Número de itens por página

  const [commitsModalIsOpen, setCommitsModalIsOpen] = useState(false); // Estado para controlar o modal de commits
  const [commitsData, setCommitsData] = useState([]); // Dados dos commits
  const [commitsCurrentPage, setCommitsCurrentPage] = useState(1); // Página atual da tabela de commits
  const COMMITS_PER_PAGE = 10; // Número de commits por página

  const [developersModalIsOpen, setDevelopersModalIsOpen] = useState(false); // Estado para controlar o modal de developers
  const [developersData, setDevelopersData] = useState([]); // Dados dos developers
  const [developersCurrentPage, setDevelopersCurrentPage] = useState(1); // Página atual da tabela de developers
  const DEVELOPERS_PER_PAGE = 10; // Número de developers por página

  const [maintenanceModalIsOpen, setMaintenanceModalIsOpen] = useState(false); // Estado para controlar o modal de Maintenance Activities
  const [maintenanceData, setMaintenanceData] = useState([]); // Dados das Maintenance Activities
  const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1); // Página atual da tabela de Maintenance Activities
  const MAINTENANCE_PER_PAGE = 10; // Número de itens por página

  const [evolutionModalIsOpen, setEvolutionModalIsOpen] = useState(false); // Estado para controlar o modal de evolução
  const [evolutionData, setEvolutionData] = useState([]); // Dados para o gráfico de evolução

  const [coEvolutionModalIsOpen, setCoEvolutionModalIsOpen] = useState(false); // Estado para controlar o modal de evolução

  const [activeTab, setActiveTab] = useState('scatter'); // Aba ativa
  const [filterEvolution, setFilterEvolution] = useState('All'); // Filtro ativo
  const [searchEvolution, setSearchEvolution] = useState(''); // Valor da busca
  const [evolutionCurrentPage, setEvolutionCurrentPage] = useState(1); // Página atual
  const EVOLUTION_PER_PAGE = 10; // Número de itens por página

  const [coEvolutionActiveTab, setCoEvolutionActiveTab] = useState('scatter'); // Aba ativa
  const [coEvolutionFilter, setCoEvolutionFilter] = useState('All'); // Filtro ativo
  const [coEvolutionSearch, setCoEvolutionSearch] = useState(''); // Valor da busca
  const [coEvolutionCurrentPage, setCoEvolutionCurrentPage] = useState(1); // Página atual
  const CO_EVOLUTION_PER_PAGE = 10; // Número de itens por página

  const filteredCoEvolution = evolutionData.filter((item) => {
    const matchesFilter =
      coEvolutionFilter === 'All' ||
      (coEvolutionFilter === 'Detected Co-evolution' && item.code_co_evolution) ||
      (coEvolutionFilter === 'Without Co-evolution' && !item.code_co_evolution);
    const matchesSearch =
      item.p_path.toLowerCase().includes(coEvolutionSearch.toLowerCase()) ||
      item.t_path.toLowerCase().includes(coEvolutionSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const indexOfLastCoEvolution = coEvolutionCurrentPage * CO_EVOLUTION_PER_PAGE;
  const indexOfFirstCoEvolution = indexOfLastCoEvolution - CO_EVOLUTION_PER_PAGE;
  const currentCoEvolution = filteredCoEvolution.slice(indexOfFirstCoEvolution, indexOfLastCoEvolution);

  const coEvolutionTotalPages = Math.ceil(filteredCoEvolution.length / CO_EVOLUTION_PER_PAGE);

  const handleCoEvolutionPageChange = (page) => {
    setCoEvolutionCurrentPage(page);
  };

  const filteredEvolution = evolutionData.filter((item) => {
    const matchesFilter =
      filterEvolution === 'All' ||
      filterEvolution === 'Production Files Added' && item.p_status_evolution === 'Added' ||
      filterEvolution === 'Test Files Added' && item.t_status_evolution === 'Added' ||
      filterEvolution === 'Production Files Modified' && item.p_status_evolution === 'Modified' ||
      filterEvolution === 'Test Files Modified' && item.t_status_evolution === 'Modified';
    const matchesSearch =
      item.p_path.toLowerCase().includes(searchEvolution.toLowerCase()) ||
      item.t_path.toLowerCase().includes(searchEvolution.toLowerCase()) ||
      item.p_status_evolution.toLowerCase().includes(searchEvolution.toLowerCase()) ||
      item.t_status_evolution.toLowerCase().includes(searchEvolution.toLowerCase()) ||
      item.revision.toLowerCase().includes(searchEvolution.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const indexOfLastEvolution = evolutionCurrentPage * EVOLUTION_PER_PAGE;
  const indexOfFirstEvolution = indexOfLastEvolution - EVOLUTION_PER_PAGE;
  const currentEvolution = filteredEvolution.slice(indexOfFirstEvolution, indexOfLastEvolution);
  
  const evolutionTotalPages = Math.ceil(filteredEvolution.length / EVOLUTION_PER_PAGE);

  const [isLoadingEvolution, setIsLoadingEvolution] = useState(false); // Estado para controlar o carregamento

  const [shareConsent, setShareConsent] = useState(false); // Estado para o switch Yes/No

  const handleShareConsentChange = async () => {
    const newConsent = !shareConsent; // Alterna o estado do consentimento

    try {
      const response = await fetch(`${API_BASE_URL}/crud/term`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ repository_id: repository.id, pipeline_id: pipeline.id, share_consent: newConsent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to update consent: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShareConsent(newConsent); // Atualiza o estado local após sucesso
      if (newConsent) {
        toast.success("You have agreed to share your results with the HighLight Test community.");
      } else {
        toast.info("You have opted out of sharing your results.");
      }
    } catch (error) {
      console.error("Error updating share consent:", error);
      toast.error("An error occurred while updating your consent.");
    }
  };
  
  const handleEvolutionPageChange = (page) => {
    setEvolutionCurrentPage(page);
  };

  const openCoEvolutionModal = async (revision) => {
    
    setCoEvolutionModalIsOpen(true); // Abre o modal

    setIsLoadingEvolution(true);
    await fetchEvolutionData(revision); // Faz a requisição ao backend somente se o array estiver vazio
    setIsLoadingEvolution(false);
    
  };
  
  const closeCoEvolutionModal = () => {
    setCoEvolutionModalIsOpen(false); // Fecha o modal
  };

  const openEvolutionModal = async (revision) => {

    console.log(revision)
    
    setEvolutionModalIsOpen(true); // Abre o modal

    setIsLoadingEvolution(true);
    await fetchEvolutionData(revision); // Faz a requisição ao backend somente se o array estiver vazio
    setIsLoadingEvolution(false);
    
  };
  
  const closeEvolutionModal = () => {
    setEvolutionModalIsOpen(false); // Fecha o modal
  };
  
  const fetchEvolutionData = async (revision) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboards/general/co_evolution_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pipeline_id: id, revision: revision }), // Passa a revisão como parâmetro
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to fetch evolution data: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setEvolutionData(data.contents); // Alimenta os dados do gráfico com o retorno do backend
    } catch (error) {
      console.error('Error fetching evolution data:', error);
      toast.error('An error occurred while fetching evolution data.');
    }
  };


  const openMaintenanceModal = async () => {
    if (maintenanceData.length === 0) { // Verifica se maintenanceData é um array vazio
      await fetchMaintenanceData(); // Faz a requisição ao backend somente se o array estiver vazio
    }
    setMaintenanceModalIsOpen(true); // Abre o modal
  };
  
  const closeMaintenanceModal = () => {
    setMaintenanceModalIsOpen(false); // Fecha o modal
  };
  
  const fetchMaintenanceData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboards/general/maintenance_activities_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pipeline_id: id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to fetch maintenance details: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setMaintenanceData(data); // Alimenta os dados do modal com o retorno do backend
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      toast.error('An error occurred while fetching maintenance details.');
    }
  };

  const [searchMaintenance, setSearchMaintenance] = useState('');

  const filteredMaintenance = maintenanceData.filter((item) => {
    const searchValue = searchMaintenance.toLowerCase();
    return (
      item.hash.toLowerCase().includes(searchValue) ||
      item.message.toLowerCase().includes(searchValue) 
    );
  });

  const indexOfLastMaintenance = maintenanceCurrentPage * MAINTENANCE_PER_PAGE;
  const indexOfFirstMaintenance = indexOfLastMaintenance - MAINTENANCE_PER_PAGE;
  const currentMaintenance = filteredMaintenance.slice(indexOfFirstMaintenance, indexOfLastMaintenance);

  const maintenanceTotalPages = Math.ceil(maintenanceData.length / MAINTENANCE_PER_PAGE);

  const handleMaintenancePageChange = (page) => {
    setMaintenanceCurrentPage(page); // Atualiza a página atual
  };

  const openDevelopersModal = async () => {
    if (developersData.length === 0) { // Verifica se developersData é um array vazio
      await fetchDevelopersData(); // Faz a requisição ao backend somente se o array estiver vazio
    }
    setDevelopersModalIsOpen(true); // Abre o modal
  };
  
  const closeDevelopersModal = () => {
    setDevelopersModalIsOpen(false); // Fecha o modal
  };
  
  const fetchDevelopersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboards/general/developers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pipeline_id: id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to fetch developers: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setDevelopersData(data.developers); // Alimenta os dados dos developers com o retorno do backend
    } catch (error) {
      console.error('Error fetching developers data:', error);
      toast.error('An error occurred while fetching developers data.');
    }
  };

  const [searchDevelopers, setSearchDevelopers] = useState('');

  const filteredDevelopers = developersData.filter((developer) =>
    developer.name.toLowerCase().includes(searchDevelopers.toLowerCase())
  );

  const indexOfLastDeveloper = developersCurrentPage * DEVELOPERS_PER_PAGE;
  const indexOfFirstDeveloper = indexOfLastDeveloper - DEVELOPERS_PER_PAGE;
  const currentDevelopers = filteredDevelopers.slice(indexOfFirstDeveloper, indexOfLastDeveloper);

  const developersTotalPages = Math.ceil(developersData.length / DEVELOPERS_PER_PAGE);

  const handleDevelopersPageChange = (page) => {
    setDevelopersCurrentPage(page); // Atualiza a página atual
  };

  const openCommitsModal = async () => {
    if (commitsData.length === 0) { // Verifica se commitsData é um array vazio
      await fetchCommitsData(); // Faz a requisição ao backend somente se o array estiver vazio
    }
    setCommitsModalIsOpen(true); // Abre o modal
  };
  
  const closeCommitsModal = () => {
    setCommitsModalIsOpen(false); // Fecha o modal
  };
  
  const fetchCommitsData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboards/general/commits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pipeline_id: id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to fetch commits: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setCommitsData(data.commits); // Alimenta os dados dos commits com o retorno do backend
    } catch (error) {
      console.error('Error fetching commits data:', error);
      toast.error('An error occurred while fetching commits data.');
    }
  };

  const [searchCommits, setSearchCommits] = useState('');

  const filteredCommits = commitsData.filter((commit) => {
    const searchValue = searchCommits.toLowerCase();
    return (
      commit.hash.toLowerCase().includes(searchValue) ||
      commit.author.toLowerCase().includes(searchValue) ||
      commit.committer.toLowerCase().includes(searchValue) ||
      new Date(commit.date).toLocaleDateString().toLowerCase().includes(searchValue) ||
      commit.msg.toLowerCase().includes(searchValue)
    );
  });

  const indexOfLastCommit = commitsCurrentPage * COMMITS_PER_PAGE;
  const indexOfFirstCommit = indexOfLastCommit - COMMITS_PER_PAGE;
  const currentCommits = filteredCommits.slice(indexOfFirstCommit, indexOfLastCommit);

  const commitsTotalPages = Math.ceil(commitsData.length / COMMITS_PER_PAGE);

  const [searchTerm, setSearchTerm] = useState('');

  const handleCommitsPageChange = (page) => {
    setCommitsCurrentPage(page); // Atualiza a página atual
  };

  const openModal = async () => {
    if (modalData.length === 0) { // Verifica se modalData é um array vazio
      await fetchModalData(); // Faz a requisição ao backend somente se o array estiver vazio
    }
    setModalIsOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Fecha o modal
  };

  const fetchModalData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboards/general/code_distribution_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pipeline_id: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to fetch data: ${errorData.detail || response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setModalData(data.contents); // Alimenta os dados do modal com o retorno do backend
    } catch (error) {
      console.error('Error fetching modal data:', error);
      toast.error('An error occurred while fetching modal data.');
    }
  };

  const filteredItems = modalData.filter((item) => {
    const matchesFilter = filter === 'all' || (filter === 'true' ? item.is_test_file === true : item.is_test_file === false);
    const matchesSearch = item.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calcula os itens da página atual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula o número total de páginas
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const [permissions, setPermissions] = useState({});
  
  const handlePageChange = (page) => {
    setCurrentPage(page); // Atualiza a página atual
  };

  useEffect(() => {

    const fetchData = async (id) => {

      const pipelineData = await fetchPipeline(id); 
      await fetchPermissions(pipelineData.repository); // Use the repository_id from the pipeline data 
      await fetchRepository(pipelineData.repository); // Use the repository_id from the pipeline data
      await fetchIndicators();

    };

    const fetchPermissions = async (repository_id) => {
      const token = localStorage.getItem('token');
      if (!token) {
          // Redirecionar para login se não houver token
          // ...
          navigate('/login');
          return
      }

      try {
          const response = await fetch(`${API_BASE_URL}/permissions/${repository_id}`, {
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
          setPermissions(data);
      } catch (error) {
          console.error("Error fetching repository:", error);
          toast.error(`Error fetching repository.`);
      }

  }
    
    const fetchPipeline = async (id) => {
      const token = localStorage.getItem('token');
      if (!token) {
          // Redirecionar para login se não houver token
        // ...
        navigate('/login');
        return
      }

      try {
          const response = await fetch(`${API_BASE_URL}/crud/pipeline/${id}`, {
              headers: {
              'Authorization': `Bearer ${token}`,
              }
          });

          if (response.status === 401) {
              localStorage.removeItem('token'); // Exemplo: remover token do localStorage
              navigate('/login');
              return;
          }

          if (response.status === 404) {
            toast.error(`HTTP error! status: ${response.status}`);
            navigate('/repositories'); // Redireciona para a página de repositórios se o pipeline não for encontrado
            return;
          }

          if (response.status !== 200) {
              toast.error(`HTTP error! status: ${response.status}`);
              throw new Error(`HTTP error! status: ${response.status}`);
          }
        
          const data = await response.json();
          setPipeline(data);
          setShareConsent(data.share_consent);
          return data;
      } catch (error) {
        console.error("Error fetching repositories:", error);
        toast.error(`Error fetching repositories.`);
        return null;
      }
    };

    const fetchRepository = async (repository_id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirecionar para login se não houver token
            // ...
            navigate('/login');
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/crud/repository/${repository_id}`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            });
            if (response.status === 401) {
                localStorage.removeItem('token'); // Exemplo: remover token do localStorage
                navigate('/login');
                return
            }

            if (response.status === 404) {
              toast.error(`HTTP error! status: ${response.status}`);
              navigate('/repositories'); // Redireciona para a página de repositórios se o pipeline não for encontrado
              return;
            }

            if (response.status !== 200) {
                toast.error(`HTTP error! status: ${response.status}.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRepository(data);
        } catch (error) {
            console.error("Error fetching repository:", error);
            toast.error(`Error fetching repository.`);
        }

    }

    const fetchIndicators = async () => {
      try {
        // Fetch data for each indicator
        const [res1, res2, res3, res4, res5, res6] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboards/general/code_distribution`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/dashboards/general/co_evolution`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/dashboards/general/clustering`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/dashboards/general/correlation`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/dashboards/general/project_dimension`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/dashboards/general/maintenance_activities`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pipeline_id: id}), 
        }).then((res) => res.json()),
        ]);

        setIndicator1(res1);
        setIndicator2(res2);
        setIndicator3(res3);
        setIndicator4(res4);
        setIndicator5(res5);
        setIndicator6(res6);
      } catch (error) {
        console.error('Error fetching indicators:', error);
        toast.error('Error fetching indicators.');
      }
    };
        
    fetchData(id);  
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />        
      <h1 className="text-center mb-4">Results</h1>
      <div className="row">

        <h3 className="text-muted">Repository: <a href={repository.clone_url} target="_blank" rel="noopener noreferrer">{repository.clone_url}</a></h3>
           
        <div className="col-md-12 mb-6">&nbsp;</div>

        {/* Indicator 5 */}
        <div className="col-md-12 mb-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Repository Statistics</h5>
              {indicator5 && (
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>Commits</td>
                      <td>
                        <a href="#" onClick={(e) => { e.preventDefault(); openCommitsModal(); }}>{indicator5.n_commits}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Developers</td>
                      <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); openDevelopersModal(); }}>{indicator5.n_devs}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Forks</td>
                      <td>{indicator5.n_forks_count}</td>
                    </tr>
                    <tr>
                      <td>Open Issues</td>
                      <td>{indicator5.n_open_issues_count}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={developersModalIsOpen}
          onRequestClose={closeDevelopersModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Developers</h5>
            <button type="button" className="btn-close" onClick={closeDevelopersModal}></button>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchDevelopers}
              onChange={(e) => setSearchDevelopers(e.target.value)} // Atualiza o estado com o valor digitado
            />
          </div>
          <div className="modal-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Number of Commits</th>
                </tr>
              </thead>
              <tbody>
                {currentDevelopers.map((developer, index) => (
                  <tr key={index}>
                    <td>{developer.name}</td>
                    <td>{developer.commits}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" className="text-end">
                    <strong>Total of {developersData.length} items</strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Paginação */}
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: developersTotalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${developersCurrentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handleDevelopersPageChange(index + 1)}
                  >
                    <button className="page-link">{index + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Modal>

        <Modal
          isOpen={commitsModalIsOpen}
          onRequestClose={closeCommitsModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Commits</h5>
            <button type="button" className="btn-close" onClick={closeCommitsModal}></button>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Hash, Author, Committer, Date, or Message"
              value={searchCommits}
              onChange={(e) => setSearchCommits(e.target.value)} // Atualiza o estado com o valor digitado
            />
          </div>
          <div className="modal-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Author</th>
                  <th>Committer</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {currentCommits.map((commit, index) => (
                  <tr key={index}>
                    <td>{commit.hash}</td>
                    <td>{commit.author}</td>
                    <td>{commit.committer}</td>
                    <td>{new Date(commit.date).toLocaleDateString()}</td>
                    <td>{commit.msg}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end">
                    <strong>Total of {commitsData.length} items</strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Paginação */}
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: commitsTotalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${commitsCurrentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handleCommitsPageChange(index + 1)}
                  >
                    <button className="page-link">{index + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Modal>

        <div className="col-md-12 mb-6">&nbsp;</div>

        {/* Indicator 4 */}
        <div className="col-md-12 mb-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Co-evolution Analysis</h5>
              {indicator4 && (
                <div>
                  <p><strong>Co-evolution Level:</strong>
                   <div
                    className={`stage badge ${
                        indicator4.co_evolution_level === "High Co-evolution"
                        ? "bg-success"
                        : indicator4.co_evolution_level === "Moderate Co-evolution"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                    >
                    {indicator4.co_evolution_level}
                    </div>
                  </p>
                  <p><strong>Correlation Coefficient:</strong> {indicator4?.pearson_correlation?.toFixed(4)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-12 mb-6">&nbsp;</div>

        {/* Indicator 2 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Code Evolution</h5>
              {indicator2 && (
                <Line
                  data={{
                    labels: Array.from({ length: indicator2?.revisions?.length }, (_, i) => `${indicator2.revisions[i]}`),
                    datasets: [
                      {
                        label: 'Production Code',
                        data: indicator2.production_code,
                        borderColor: '#36A2EB',
                        fill: false,
                      },
                      {
                        label: 'Test Code',
                        data: indicator2.test_code,
                        borderColor: '#FF6384',
                        fill: false,
                      }
                    ],
                  }}
                  options={{
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                          const index = elements[0].index; // Obtém o índice do ponto clicado
                          const revision = indicator2.revisions[index]; // Obtém o valor do label correspondente
                          
                          openEvolutionModal(revision); // Passa o valor do eixo X para a função
                      }
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Revisions',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Lines of Code (%)',
                        },
                      },
                    },
                  }}
                  style={{ cursor: 'pointer' }} // Adiciona o estilo de cursor
                />
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={evolutionModalIsOpen}
          onRequestClose={closeEvolutionModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Change History View</h5>
            <button type="button" className="btn-close" onClick={closeEvolutionModal}></button>
          </div>
          <div className="modal-body">

            <div className="alert alert-warning text-center">
              This feature is only available for projects developed in Java.
            </div>

          {isLoadingEvolution ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            ) : (
            <>

            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'scatter' ? 'active' : ''}`}
                  onClick={() => setActiveTab('scatter')}
                >
                  Scatter View
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'table' ? 'active' : ''}`}
                  onClick={() => setActiveTab('table')}
                >
                  Table View
                </button>
              </li>
            </ul>

            {activeTab === 'scatter' && (
              <Scatter
                data={{
                  datasets: [
                    {
                      label: 'Production Files Added',
                      data: evolutionData
                        .filter((item) => item.p_status_evolution === 'Added')
                        .map((item, index) => ({ x: item.revision, y: 2 * index + 1 })),
                      borderColor: '#36A2EB',
                      backgroundColor: '#36A2EB',
                    },
                    {
                      label: 'Production Files Modified',
                      data: evolutionData
                        .filter((item) => item.p_status_evolution === 'Modified')
                        .map((item, index) => ({ x: item.revision, y: 2 * index + 1 })),
                      borderColor: '#FF6384',
                      backgroundColor: '#FF6384',
                    },
                    {
                      label: 'Test Files Added',
                      data: evolutionData
                        .filter((item) => item.t_status_evolution === 'Added')
                        .map((item, index) => ({ x: item.revision, y: 2 * (index + 1) })),
                      borderColor: '#4BC0C0',
                      backgroundColor: '#4BC0C0',
                    },
                    {
                      label: 'Test Files Modified',
                      data: evolutionData
                        .filter((item) => item.t_status_evolution === 'Modified')
                        .map((item, index) => ({ x: item.revision, y: 2 * (index + 1) })),
                      borderColor: '#FFCE56',
                      backgroundColor: '#FFCE56',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      type: 'category',
                      title: {
                        display: true,
                        text: 'Revisions',
                      },
                      // Centraliza os pontos quando há apenas uma revisão
                      ...(evolutionData.length > 0 && new Set(evolutionData.map(item => item.revision)).size === 1 && {
                        min: -0.5,
                        max: 0.5,
                        offset: true,
                      })
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'File ID',
                      },
                    },
                  },
                }}
              />
            )}

            <div className="col-md-12 mb-6">&nbsp;</div>

            {activeTab === 'table' && (
              <div>
                <div className="mb-3">
                  <button
                    className={`btn ${filterEvolution === 'All' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setFilterEvolution('All')}
                  >
                    All
                  </button>
                  <button
                    className={`btn ${filterEvolution === 'Production Files Added' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setFilterEvolution('Production Files Added')}
                  >
                    Production Files Added
                  </button>
                  <button
                    className={`btn ${filterEvolution === 'Production Files Modified' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setFilterEvolution('Production Files Modified')}
                  >
                    Production Files Modified
                  </button>
                  <button
                    className={`btn ${filterEvolution === 'Test Files Added' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setFilterEvolution('Test Files Added')}
                  >
                    Test Files Added
                  </button>
                  <button
                    className={`btn ${filterEvolution === 'Test Files Modified' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterEvolution('Test Files Modified')}
                  >
                    Test Files Modified
                  </button>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Path, Status, or Revision"
                    value={searchEvolution}
                    onChange={(e) => setSearchEvolution(e.target.value)}
                  />
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Production Path</th>
                      <th>Production Status</th>
                      <th>Test Path</th>
                      <th>Test Status</th>
                      <th>Revision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvolution.map((item, index) => (
                      <tr key={index}>
                        <td>{item.p_path}</td>
                        <td>{item.p_status_evolution}</td>
                        <td>{item.t_path}</td>
                        <td>{item.t_status_evolution}</td>
                        <td>{item.revision}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="text-end">
                        <strong>Total of {filteredEvolution.length} items</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <nav>
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: evolutionTotalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${evolutionCurrentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handleEvolutionPageChange(index + 1)}
                      >
                        <button className="page-link">{index + 1}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              )}
             </>
            )}
          </div>
        </Modal>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Test Evolution</h5>
              {indicator2 && (
                <Line
                  data={{
                    labels: Array.from({ length: indicator2?.revisions?.length }, (_, i) => `${indicator2.revisions[i]}`),
                    datasets: [
                      {
                        label: 'Ratio Code',
                        data: indicator2.ratio_code,
                        borderColor: '#4BC0C0',
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                          const index = elements[0].index; // Obtém o índice do ponto clicado
                          const revision = indicator2.revisions[index]; // Obtém o valor do label correspondente
                          
                          openCoEvolutionModal(revision); // Passa o valor do eixo X para a função
                      }
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Revisions',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Lines of Code (%)',
                        },
                      },
                    },
                  }}
                  style={{ cursor: 'pointer' }} // Adiciona o estilo de cursor
                />
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={coEvolutionModalIsOpen}
          onRequestClose={closeCoEvolutionModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Co-evolution History View</h5>
            <button type="button" className="btn-close" onClick={closeCoEvolutionModal}></button>
          </div>
          <div className="modal-body">

            <div className="alert alert-warning text-center">
              This feature is only available for projects developed in Java.
            </div>

            {isLoadingEvolution ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
            <>

            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${coEvolutionActiveTab === 'scatter' ? 'active' : ''}`}
                  onClick={() => setCoEvolutionActiveTab('scatter')}
                >
                  Scatter View
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${coEvolutionActiveTab === 'table' ? 'active' : ''}`}
                  onClick={() => setCoEvolutionActiveTab('table')}
                >
                  Table View
                </button>
              </li>
            </ul>

            {coEvolutionActiveTab === 'scatter' && (
              <Scatter
                data={{
                  datasets: [
                    {
                      label: 'Detected Co-evolution',
                      data: evolutionData
                        .filter((item) => item.code_co_evolution === true)
                        .map((item, index) => ({ x: item.revision, y: 2 * index + 1 })),
                      borderColor: '#36A2EB',
                      backgroundColor: '#36A2EB',
                    },
                    {
                      label: 'Without Co-evolution',
                      data: evolutionData
                        .filter((item) => item.code_co_evolution === false)
                        .map((item, index) => ({ x: item.revision, y: 2 * (index + 1) })),
                      borderColor: '#FF6384',
                      backgroundColor: '#FF6384',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      type: 'category',
                      title: {
                        display: true,
                        text: 'Revisions',
                      },
                      // Centraliza os pontos quando há apenas uma revisão
                      ...(evolutionData.length > 0 && new Set(evolutionData.map(item => item.revision)).size === 1 && {
                        min: -0.5,
                        max: 0.5,
                        offset: true,
                      })
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'File ID',
                      },
                    },
                  },
                }}
              />
            )}
            
            <div className="col-md-12 mb-6">&nbsp;</div>

            {coEvolutionActiveTab === 'table' && (
              <div>
                <div className="mb-3">
                  <button
                    className={`btn ${coEvolutionFilter === 'All' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setCoEvolutionFilter('All')}
                  >
                    All
                  </button>
                  <button
                    className={`btn ${coEvolutionFilter === 'Detected Co-evolution' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setCoEvolutionFilter('Detected Co-evolution')}
                  >
                    Detected Co-evolution
                  </button>
                  <button
                    className={`btn ${coEvolutionFilter === 'Without Co-evolution' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCoEvolutionFilter('Without Co-evolution')}
                  >
                    Without Co-evolution
                  </button>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Path"
                    value={coEvolutionSearch}
                    onChange={(e) => setCoEvolutionSearch(e.target.value)}
                  />
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Production Path</th>
                      <th>Test Path</th>
                      <th>Code Co-evolution</th>
                      <th>Revision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCoEvolution.map((item, index) => (
                      <tr key={index}>
                        <td>{item.p_path}</td>
                        <td>{item.t_path}</td>
                        <td>{item.code_co_evolution ? 'Yes' : 'No'}</td>
                        <td>{item.revision}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end">
                        <strong>Total of {filteredCoEvolution.length} items</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <nav>
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: coEvolutionTotalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${coEvolutionCurrentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handleCoEvolutionPageChange(index + 1)}
                      >
                        <button className="page-link">{index + 1}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
               )}
              </>
            )}
          </div>
        </Modal>

        <div className="col-md-12 mb-6">&nbsp;</div>

        
        {/* Indicator 1 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Production vs Test Code Overview</h5>
              {indicator1 && (
                <Bar
                  data={{
                    labels: ['Production Code', 'Test Code'],
                    datasets: [
                      {
                        label: 'Lines of Code (%)',
                        data: [indicator1.production_code, indicator1.test_code],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        borderColor: ['#36A2EB', '#FF6384'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    onClick: openModal, // Abre o modal ao clicar no gráfico
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Code Type',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Percentage (%)',
                        },
                      },
                    },
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Code Details</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">

            <div className="mb-3">
              <button
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`btn ${filter === 'false' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('false')}
              >
                Production Files
              </button>
              <button
                className={`btn ${filter === 'true' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                onClick={() => setFilter('true')}
              >
                Test Files
              </button>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Path"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o valor digitado
              />
            </div>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>LOC</th>
                  <th>Is Test File?</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.path}</td>
                    <td>{item.loc}</td>
                    <td>{item.is_test_file ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Total of {filteredItems.length} items</strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Paginação */}
            <nav>
              <ul className="pagination justify-content-center">
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
        </Modal>

        {/* Indicator 6 */}
        <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
                <div className="card-body">
                <h5 className="card-title">Distribution of Maintenance Activities</h5>
                {indicator6 && (
                    <Bar
                    data={{
                        labels: ['Corrective', 'Adaptive', 'Perfective', 'Multi'],
                        datasets: [
                        {
                            label: 'Maintenance Activities (%)',
                            data: [
                            indicator6.n_corrective,
                            indicator6.n_adaptive,
                            indicator6.n_perfective,
                            indicator6.n_multi,
                            ],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                            borderWidth: 1,
                        },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        },
                        onClick: openMaintenanceModal, // Abre o modal ao clicar no gráfico
                        scales: {
                        x: {
                            title: {
                            display: true,
                            text: 'Categories',
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                            display: true,
                            text: 'Percentage (%)',
                            },
                        },
                        },
                    }}
                    style={{ cursor: 'pointer' }} // Adiciona o estilo de cursor
                    />
                )}
                </div>
            </div>
        </div>

        <Modal
          isOpen={maintenanceModalIsOpen}
          onRequestClose={closeMaintenanceModal}
          className="my-modal-content"
          overlayClassName="modal-overlay"
          closeTimeoutMS={200}
        >
          <div className="modal-header">
            <h5 className="modal-title">Maintenance Activities Details</h5>
            <button type="button" className="btn-close" onClick={closeMaintenanceModal}></button>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Hash or Message"
              value={searchMaintenance}
              onChange={(e) => setSearchMaintenance(e.target.value)} // Atualiza o estado com o valor digitado
            />
          </div>
          <div className="modal-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Message</th>
                  <th>Bug Fix Count</th>
                  <th>Adaptive Count</th>
                  <th>Perfective Count</th>
                  <th>Refactor Count</th>
                </tr>
              </thead>
              <tbody>
                {currentMaintenance.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hash}</td>
                    <td>{item.message}</td>
                    <td>{item.bug_fix_regex_count}</td>
                    <td>{item.adaptive_regex_count}</td>
                    <td>{item.perfective_regex_count}</td>
                    <td>{item.refactor_regex_count}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-end">
                    <strong>Total of {maintenanceData.length} items</strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Paginação */}
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: maintenanceTotalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${maintenanceCurrentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handleMaintenancePageChange(index + 1)}
                  >
                    <button className="page-link">{index + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Modal>

        
        <div className="col-md-12 mb-6">&nbsp;</div>

        
        {/* Indicator 3 */}
        <div className="col-md-12 mb-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title"> {indicator3 && indicator3.cluster_name} Patterns Identified</h5>
              {indicator3 && (
                <div className="text-muted text-center">
                  <ReactMarkdown>{indicator3.cluster_insights}</ReactMarkdown> 
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 mb-6">&nbsp;</div>

      {permissions.edit && (
        <div className="row"> 
            <div className="mt-5 p-4 border rounded bg-light">
                <h3 className="text-center">Share Your Results with the HighLight Test Community</h3>
                <p className="text-muted mt-3">
                  By sharing your results, you contribute to the improvement of software development practices. 
                  Your data will be used by researchers, managers, and developers to better understand the 
                  co-evolution of test and production code. All sensitive data will not be shared and will not violate any principles of the <strong>General Data Protection Law (LGPD)</strong>.
                </p>
                <p className="text-muted">
                  You can revoke your consent at any time, and your data will no longer be shared with the 
                  community.
                </p>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <label className="me-3">Would you like to share your results?</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="shareConsentSwitch"
                      checked={shareConsent}
                      onChange={handleShareConsentChange}
                    />
                    <label className="form-check-label" htmlFor="shareConsentSwitch">
                      {shareConsent ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mb-6">&nbsp;</div>
        </div>
      )}
      <div className="col-md-12 mb-6">&nbsp;</div>
    </div>
  );
}

export default PipelineDetails;