import React, { useState, useEffect } from "react";

import "./styles.css";

import api from "./services/api";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState("");
  const [repositoriesList, setRepositoriesList] = useState([]);

  async function handleAddRepository(evt) {
    evt.preventDefault();
    try {
      const arrayTechs = techs.split(",");

      const { data } = await api.post("/repositories", {
        title,
        url,
        techs: arrayTechs,
      });

      setRepositoriesList((prevState) => [...prevState, data]);

      setTitle("");
      setTechs("");
      setUrl("");
    } catch (error) {
      console.log(error);
      alert("Ocorreu um erro ao inserir o repositório. Tente novamente!");
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);

      const filtedRepo = repositoriesList.filter(
        (repository) => repository.id !== id
      );
      setRepositoriesList(filtedRepo);
    } catch (error) {
      console.log(error);
      alert("Ocorreu um erro ao deleter o repositório. Tente novamente!");
    }
  }

  useEffect(() => {
    api
      .get("repositories")
      .then((response) => {
        setRepositoriesList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <h2>GoStack - Desafio ReactJS</h2>
      <h3>App Repositórios favoridos</h3>

      <hr style={{ margin: "10px 0" }} />

      <div className="repository-list">
        {!!repositoriesList.length ? (
          <ul data-testid="repository-list">
            {repositoriesList.map((repository) => (
              <li key={repository.id}>
                <a
                  href={`${repository.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{repository.title}</span>
                </a>
                <span>{repository.techs.join(", ")}</span>
                <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>Nenhum repositório registrado</div>
        )}
      </div>

      <hr />

      <form onSubmit={handleAddRepository} className="form-wrapper">
        <center>
          <h3>Incluir novo Repositório a Lista</h3>
        </center>
        <div className="input-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titule do repositório"
            value={title}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Insira o link do repositório"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="techs">Tecnologia</label>
          <input
            type="text"
            id="techs"
            name="techs"
            onChange={(e) => setTechs(e.target.value)}
            value={techs}
            placeholder="Insira a tecnologia"
            required
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default App;
