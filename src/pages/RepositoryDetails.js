import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Repositories from "./Repositories"; // Importe o componente Repositories do arquivo Repositories.js (ou onde ele estiver definido)
import { API_BASE_URL } from "../Constants"; // Importe do arquivo config.js
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RepositoryDetails() {
  const { repository_id } = useParams();
  const [additionalData, setAdditionalData] = useState(null);
  const navigate = useNavigate();

  // ... (buscar detalhes do repositorio com base na id)
  const fetchAdditionalDatas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirecionar para login se não houver token
      // ...
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/crud/additional_data/repository/${repository_id}`,
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
      setAdditionalData(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error(`Error fetching repositories.`);
    }
  };

  useEffect(() => {
    fetchAdditionalDatas();
  }, [repository_id]);

  if (!additionalData) {
    return <div>Loading repository details...</div>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h1 className="text-center mb-4">Repository Details</h1>
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h2 className="card-title text-primary">{additionalData.name}</h2>
          <h3 className="card-subtitle mb-3 text-muted">
            {additionalData.full_name}
          </h3>
          <p className="card-text">
            <strong>Created at:</strong>{" "}
            {new Date(additionalData.created_at).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Pushed at:</strong>{" "}
            {new Date(additionalData.pushed_at).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Language:</strong> {additionalData.language}
          </p>
          <div className="text-center mt-4">
            <Link
              to={`/pipelines/repository/${repository_id}`}
              className="btn btn-primary"
            >
              View Pipelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryDetails;