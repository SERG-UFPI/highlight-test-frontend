import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../Constants"; // Importe do arquivo config.js
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Pipelines() {
  const { repository_id } = useParams();
  const [repository, setRepository] = useState([]);
  const [pipelines, setPipelines] = useState({ items: [], total: 0 });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento do botão
  const [permissions, setPermissions] = useState({});

  const fetchPermissions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirecionar para login se não houver token
      // ...
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/permissions/${repository_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token"); // Exemplo: remover token do localStorage
        navigate("/login");
        return;
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
  };

  const fetchRepository = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirecionar para login se não houver token
      // ...
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/crud/repository/${repository_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token"); // Exemplo: remover token do localStorage
        navigate("/login");
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
  };

  const fetchPipelines = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirecionar para login se não houver token
      // ...
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/crud/pipeline/repository/${repository_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token"); // Exemplo: remover token do localStorage
        navigate("/login");
        return;
      }

      if (response.status !== 200) {
        toast.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPipelines(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error(`Error fetching repositories.`);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchRepository();
    fetchPipelines();
  }, [repository_id]);

  const handleCloneRepository = async (pipeline) => {
    try {
      const response = await fetch(`${API_BASE_URL}/process/clone/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pipeline_id: pipeline.id,
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        toast.success("Action performed successfully.");
        setIsLoading(false);
      } else {
        // Lidar com erros de registro
        const errorData = await response.json();
        toast.error(
          `Could not complete the operation: ${
            errorData.detail || response.statusText
          }.`
        );
        console.error(
          "Could not complete the operation:",
          response.status,
          response.statusText
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`An unexpected error occurred: ${error}.`);
      toast.error(`An unexpected error occurred.`);
      setIsLoading(false);
    }
  };

  const handleNewPipeline = async () => {
    const confirmCreation = window.confirm(
      "Are you sure you want to create a new pipeline for this repository?"
    );
    if (!confirmCreation) {
      return; // Sai da função se o usuário cancelar
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento
    try {
      const response = await fetch(`${API_BASE_URL}/crud/pipeline/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ repository: repository_id }), // Envia o ID do repositório
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Failed to create pipeline: ${
            errorData.detail || response.statusText
          }`
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPipeline = await response.json();

      await handleCloneRepository(newPipeline);

      toast.success("Pipeline created successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error creating pipeline:", error);
      toast.error("An error occurred while creating the pipeline.");
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <p className="text-muted">
        Repository:{" "}
        <a
          href={repository.clone_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {repository.clone_url}
        </a>
      </p>
      <h1 className="text-center mb-4">Pipelines</h1>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Current Stage</th>
            <th>Current Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Stages</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pipelines.items.map((pipeline) => (
            <tr key={pipeline.id}>
              <td>{pipeline.stage}</td>
              <td>
                <span
                  className={`badge ${
                    pipeline.status === "Completed"
                      ? "bg-success"
                      : pipeline.status === "In progress"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {pipeline.status}
                </span>
              </td>
              <td>{new Date(pipeline.created_at).toLocaleDateString()}</td>
              <td>{new Date(pipeline.updated_at).toLocaleDateString()}</td>
              <td>
                <div className="stages d-flex gap-2">
                  {(() => {
                    // Determina o índice do stage atual
                    const stages = [
                      { name: "Clone Repositories", key: "CLONE" },
                      { name: "Extract Commit Data", key: "EXTRACT_COMMITS" },
                      {
                        name: "Generate Time Series",
                        key: "GENERATE_TIME_SERIES",
                      },
                      { name: "Calculate Metrics", key: "CALCULATE_METRICS" },
                      {
                        name: "Co-evolution Analysis",
                        key: "CO_EVOLUTION_ANALYSIS",
                      },
                    ];

                    const stageIndex = stages.findIndex(
                      (stage) => stage.name === pipeline.stage
                    );

                    // Renderiza os stages com base no status
                    return stages.map((stage, index) => {
                      const isCompleted =
                        index < stageIndex ||
                        (index === stageIndex &&
                          pipeline.status === "Completed");
                      const isInProgress =
                        index === stageIndex &&
                        pipeline.status === "In progress";
                      const isError =
                        index === stageIndex && pipeline.status === "Error";

                      return (
                        <div
                          key={stage.key}
                          className={`stage badge ${
                            isCompleted
                              ? "bg-success"
                              : isInProgress
                              ? "bg-warning text-dark"
                              : isError
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {stage.name}
                        </div>
                      );
                    });
                  })()}
                </div>
              </td>
              <td>
                {pipeline.stage === "Co-evolution Analysis" &&
                pipeline.status === "Completed" ? (
                  <Link
                    to={`/pipelines/${pipeline.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    Processing...
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mb-4">
        {permissions.create && ( // Verifica se permissions.create é true
          <button
            onClick={handleNewPipeline}
            className="btn btn-success"
            disabled={isLoading} // Desativa o botão enquanto está carregando
          >
            {isLoading ? "Creating..." : "New Pipeline"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Pipelines;