import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { API_BASE_URL, API_GITHUB_URL } from '../Constants'; 
import Repositories from './Repositories'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root') // configure o Modal

function NewRepositoryModal({ isOpen, onRequestClose, initialData }) {
    const [cloneUrl, setCloneUrl] = useState(initialData.cloneUrl || "");
    const [defaultBranch, setDefaultBranch] = useState(initialData.defaultBranch || "");
    const [repoGit, setRepoGit] = useState('');
    const [repository, setRepository] = useState('');
    const [additionalData, setAdditionalData] = useState('');
    const [pipeline, setPipeline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    const handleAddRepository = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {
            
            const response = await fetch(`${API_BASE_URL}/crud/repository/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ clone_url: cloneUrl, default_branch: defaultBranch }), 
            });
            
            if (response.status === 200) {
                const data = await response.json();
                setRepository(data);
                
                return data;

            } else {

                if (response.status === 401) {
                    localStorage.removeItem('token'); // Exemplo: remover token do localStorage
                    navigate('/login');
                    return
                }

                // Lidar com erros de registro
                const errorData = await response.json();
                console.error("Could not complete the operation:", response.status, response.statusText);

                return null;
            }

        } catch (error) {
            toast.error(`An unexpected error occurred.`);

            return null;

        }

    }

    const fetchGitHubRepository = async (event) => {

        event.preventDefault(); // Impede o recarregamento da página

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirecionar para login se não houver token
            // ...
            navigate('/login');
            return
        }

        if (!cloneUrl.startsWith('https://github.com/') || !cloneUrl.endsWith('.git')) {
            toast.error('Invalid Clone URL. It must start with "https://github.com/" and end with ".git".');
            setIsLoading(false);
            return;
        }

        const repoGithubUrl = cloneUrl.replace(/\.git$/, '').replace(/^https:\/\/github\.com\//, ''); // Remove .git e https://github.com/
        setIsLoading(true);
        try {
            const response = await fetch(`${API_GITHUB_URL}/${repoGithubUrl}`);
            if (!response.ok) {
                toast.error(`HTTP error! status from GitHub: ${response.status}.`);
                throw new Error(`HTTP error! status from GitHub: ${response.status}`);
            }
            const data = await response.json();
            setRepoGit(data);

            const repoGitData = data;
            const repositoryData = await handleAddRepository(event);
            if (repositoryData) {
                const additionalData = await handleAddAdditionalData(event, repoGitData, repositoryData);
                if (additionalData) {
                    const pipelineData = await handleAddPipeline(event, repositoryData, additionalData);
                    if (pipelineData) {
                        await handleCloneRepository(event, pipelineData);         
                        toast.success("Repository added successfully!");

                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                }
                
            }
        
        } catch (error) {
            console.error("Error during repository setup:", error);
            toast.error("An error occurred during the repository setup.");
        } finally {
            setIsLoading(false);
        }

        

    }

    const handleAddAdditionalData = async (event, repoGit, repository) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {

            const response = await fetch(`${API_BASE_URL}/crud/additionalData/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                    repository: repository.id, 
                    name: repoGit.name,
                    full_name: repoGit.full_name,
                    language: repoGit.language,
                    forks_count: repoGit.forks_count,
                    open_issues_count: repoGit.open_issues_count,
                    created_at: repoGit.created_at,
                    pushed_at: repoGit.pushed_at,
                    external_id: String(repoGit.id), 
                }), 
            });

            if (response.status === 200) {
                const data = await response.json();
                setAdditionalData(data);
                return data;
            } else {

                handleDeleteRepository(event, repository); // Chama a função para deletar o repositório após falhar ao adicionar o pipeline no backend
            
                // Lidar com erros de registro
                const errorData = await response.json();
                console.error("Could not complete the operation:", response.status, response.statusText);
                return null;
            }

        } catch (error) {

            handleDeleteRepository(event, repository); // Chama a função para deletar o repositório após falhar ao adicionar o pipeline no backend
            
            console.error(`An unexpected error occurred: ${error}.`);

            return null;

        }

    }

    const handleAddPipeline = async (event, repository, additionalData) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {

            const response = await fetch(`${API_BASE_URL}/crud/pipeline/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                    repository: repository.id
                }), 
            });

            if (response.status === 200) {
                const data = await response.json();
                setPipeline(data);

                return data;
            } else {

                handleDeleteAdditionalData(event, additionalData); // Chama a função para deletar os dados adicionais após falhar ao adicionar o pipeline no backend
                handleDeleteRepository(event, repository); // Chama a função para deletar o repositório após falhar ao adicionar o pipeline no backend
                
                // Lidar com erros de registro
                const errorData = await response.json();
                console.error("Could not complete the operation:", response.status, response.statusText);

                return null;
            }

        } catch (error) {

            handleDeleteAdditionalData(event, additionalData); // Chama a função para deletar os dados adicionais após falhar ao adicionar o pipeline no backend
            handleDeleteRepository(event, repository); // Chama a função para deletar o repositório após falhar ao adicionar o pipeline no backend
                   
            console.error(`An unexpected error occurred: ${error}.`);

            return null;

        }

    }

    const handleCloneRepository = async (event, pipeline) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {

            const response = await fetch(`${API_BASE_URL}/process/clone/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                    pipeline_id: pipeline.id
                }), 
            });

            if (response.status === 202) {
                const data = await response.json();
                toast.success("Action performed successfully.");
                setIsLoading(false);
            } else {
                // Lidar com erros de registro
                const errorData = await response.json();
                toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
                console.error("Could not complete the operation:", response.status, response.statusText);
                setIsLoading(false);
            }

        } catch (error) {
            console.error(`An unexpected error occurred: ${error}.`);
            toast.error(`An unexpected error occurred.`);
            setIsLoading(false);

        }

    }

    const handleDeleteAdditionalData = async (event, additionalData) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {

            const response = await fetch(`${API_BASE_URL}/crud/additionalData/${additionalData.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: {}, 
            });

            if (response.ok) {
                console.info("Action performed successfully.");
            } else {
                // Lidar com erros de registro
                const errorData = await response.json();
                toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
                console.error("Could not complete the operation:", response.status, response.statusText);
            }

        } catch (error) {
            console.error(`An unexpected error occurred: ${error}.`);
            toast.error(`An unexpected error occurred.`);

        }

    }

    const handleDeleteRepository = async (event, repository) => {
        event.preventDefault(); // Impede o recarregamento da página

        try {

            const response = await fetch(`${API_BASE_URL}/crud/repository/${repository.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: {}, 
            });

            if (response.ok) {
                console.info("Action performed successfully.");
            } else {
                // Lidar com erros de registro
                const errorData = await response.json();
                toast.error(`Could not complete the operation: ${errorData.detail || response.statusText}.`);
                console.error("Could not complete the operation:", response.status, response.statusText);
            }

        } catch (error) {
            console.error(`An unexpected error occurred: ${error}.`);
            toast.error(`An unexpected error occurred.`);

        }

    }

    useEffect(() => {
        setCloneUrl(initialData.cloneUrl || "");
        setDefaultBranch(initialData.defaultBranch || "");
    }, [initialData]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="my-modal-content" overlayClassName="modal-overlay" closeTimeoutMS={200}>
            <ToastContainer />
            <div className="modal-content">
                <div className="modal-header">
                <h2 className="modal-title">New Repository</h2>
                <button type="button" className="btn-close" onClick={onRequestClose} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <form onSubmit={(e) => fetchGitHubRepository(e)}>
                    <div className="mb-3">
                    <label htmlFor="cloneUrl" className="form-label">Clone URL *</label>
                    <input
                        required
                        type="text"
                        id="cloneUrl"
                        className="form-control"
                        value={cloneUrl}
                        onChange={(e) => setCloneUrl(e.target.value)}
                        placeholder="e.g., https://github.com/example/example.git"
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="defaultBranch" className="form-label">Default Branch *</label>
                    <input
                        required
                        type="text"
                        id="defaultBranch"
                        className="form-control"
                        value={defaultBranch}
                        onChange={(e) => setDefaultBranch(e.target.value)}
                        placeholder="e.g., master"
                    />
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Repository'}</button>
                    </div>
                </form>
                </div>
            </div>
            </Modal>
    );

}



export default NewRepositoryModal;