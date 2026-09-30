import { useEffect, useState } from "react";

interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  prioridade: string;
  prazo: string;
  responsavel: string;
  progresso: number;
}

function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [prioridade, setPrioridade] = useState("Média");
  const [prazo, setPrazo] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [progresso, setProgresso] = useState("0");

  const [projetoEditando, setProjetoEditando] =
    useState<Projeto | null>(null);

  useEffect(() => {
    carregarProjetos();
  }, []);

  async function carregarProjetos() {
    try {
      const resposta = await fetch(
        "http://localhost:8081/projetos"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar projetos");
      }

      const dados = await resposta.json();

      setProjetos(dados);
    } catch (erro) {
      console.error(
        "Erro ao carregar projetos:",
        erro
      );
    }
  }

  function limparFormulario() {
    setNome("");
    setDescricao("");
    setStatus("Pendente");
    setPrioridade("Média");
    setPrazo("");
    setResponsavel("");
    setProgresso("0");
  }

  async function adicionarProjeto() {
    if (!nome.trim()) {
      alert("Digite o nome do projeto.");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:8081/projetos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nome.trim(),
            descricao: descricao.trim(),
            status,
            prioridade,
            prazo,
            responsavel: responsavel.trim(),
            progresso: Number(progresso),
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar projeto");
      }

      const novoProjeto = await resposta.json();

      setProjetos((projetosAtuais) => [
        ...projetosAtuais,
        novoProjeto,
      ]);

      limparFormulario();
    } catch (erro) {
      console.error(
        "Erro ao cadastrar projeto:",
        erro
      );

      alert(
        "Não foi possível cadastrar o projeto."
      );
    }
  }

  async function excluirProjeto(id: number) {
    try {
      const resposta = await fetch(
        "http://localhost:8081/projetos",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir projeto");
      }

      setProjetos((projetosAtuais) =>
        projetosAtuais.filter(
          (projeto) => projeto.id !== id
        )
      );
    } catch (erro) {
      console.error(
        "Erro ao excluir projeto:",
        erro
      );

      alert(
        "Não foi possível excluir o projeto."
      );
    }
  }

  function abrirEdicao(id: number) {
    const projeto = projetos.find(
      (projeto) => projeto.id === id
    );

    if (!projeto) {
      return;
    }

    setProjetoEditando(projeto);
  }

  async function salvarEdicao() {
    if (!projetoEditando) {
      return;
    }

    if (!projetoEditando.nome.trim()) {
      alert("Digite o nome do projeto.");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:8081/projetos",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...projetoEditando,
            nome: projetoEditando.nome.trim(),
            descricao:
              projetoEditando.descricao.trim(),
            responsavel:
              projetoEditando.responsavel.trim(),
            progresso: Number(
              projetoEditando.progresso
            ),
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao atualizar projeto"
        );
      }

      const projetoAtualizado =
        await resposta.json();

      setProjetos((projetosAtuais) =>
        projetosAtuais.map((projeto) =>
          projeto.id === projetoEditando.id
            ? projetoAtualizado
            : projeto
        )
      );

      setProjetoEditando(null);
    } catch (erro) {
      console.error(
        "Erro ao atualizar projeto:",
        erro
      );

      alert(
        "Não foi possível atualizar o projeto."
      );
    }
  }

  function formatarPrazo(prazo: string) {
    if (!prazo) {
      return "Sem prazo";
    }

    const data = new Date(
      `${prazo}T00:00:00`
    );

    if (Number.isNaN(data.getTime())) {
      return prazo;
    }

    return data.toLocaleDateString("pt-BR");
  }

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <h2>Projetos</h2>

          <p>
            Gerencie seus projetos e acompanhe o
            progresso.
          </p>
        </div>
      </div>

      <div className="panel project-form">
        <h2>Novo projeto</h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome do projeto"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) =>
              setDescricao(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="Pendente">
              Pendente
            </option>

            <option value="Em andamento">
              Em andamento
            </option>

            <option value="Concluído">
              Concluído
            </option>
          </select>

          <select
            value={prioridade}
            onChange={(e) =>
              setPrioridade(e.target.value)
            }
          >
            <option value="Alta">
              Alta
            </option>

            <option value="Média">
              Média
            </option>

            <option value="Baixa">
              Baixa
            </option>
          </select>

          <input
            type="date"
            value={prazo}
            onChange={(e) =>
              setPrazo(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Responsável"
            value={responsavel}
            onChange={(e) =>
              setResponsavel(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            max="100"
            placeholder="Progresso (%)"
            value={progresso}
            onChange={(e) =>
              setProgresso(e.target.value)
            }
          />

          <button
            className="primary-button"
            onClick={adicionarProjeto}
          >
            + Adicionar projeto
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {projetos.map((projeto) => (
          <article
            className="panel project-card"
            key={projeto.id}
          >
            <div className="project-card-header">
              <div>
                <h2>{projeto.nome}</h2>

                <p>
                  {projeto.descricao ||
                    "Sem descrição."}
                </p>
              </div>

              <span
                className={`status ${
                  projeto.status === "Concluído"
                    ? "done"
                    : projeto.status ===
                      "Em andamento"
                    ? "progress"
                    : "pending"
                }`}
              >
                {projeto.status}
              </span>
            </div>

            <div className="project-details">
              <div className="project-priority">
                <span>Prioridade</span>

                <strong>
                  {projeto.prioridade}
                </strong>
              </div>

              <div>
                <span>Prazo</span>

                <strong>
                  {formatarPrazo(projeto.prazo)}
                </strong>
              </div>

              <div>
                <span>Responsável</span>

                <strong>
                  {projeto.responsavel ||
                    "Não definido"}
                </strong>
              </div>

              <div>
                <span>Progresso</span>

                <strong>
                  {projeto.progresso}%
                </strong>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${projeto.progresso}%`,
                }}
              />
            </div>

            <div className="project-actions">
              <button
                className="edit-button"
                onClick={() =>
                  abrirEdicao(projeto.id)
                }
              >
                Editar projeto
              </button>

              <button
                className="delete-button"
                onClick={() =>
                  excluirProjeto(projeto.id)
                }
              >
                Excluir projeto
              </button>
            </div>
          </article>
        ))}
      </div>

      {projetoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Editar projeto</h2>

                <p>
                  Atualize as informações do
                  projeto.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setProjetoEditando(null)
                }
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Nome do projeto"
                value={projetoEditando.nome}
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    nome: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Descrição"
                value={
                  projetoEditando.descricao
                }
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    descricao:
                      e.target.value,
                  })
                }
              />

              <select
                value={
                  projetoEditando.status
                }
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pendente">
                  Pendente
                </option>

                <option value="Em andamento">
                  Em andamento
                </option>

                <option value="Concluído">
                  Concluído
                </option>
              </select>

              <select
                value={
                  projetoEditando.prioridade
                }
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    prioridade:
                      e.target.value,
                  })
                }
              >
                <option value="Alta">
                  Alta
                </option>

                <option value="Média">
                  Média
                </option>

                <option value="Baixa">
                  Baixa
                </option>
              </select>

              <input
                type="date"
                value={projetoEditando.prazo}
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    prazo: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Responsável"
                value={
                  projetoEditando.responsavel
                }
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    responsavel:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                min="0"
                max="100"
                placeholder="Progresso (%)"
                value={
                  projetoEditando.progresso
                }
                onChange={(e) =>
                  setProjetoEditando({
                    ...projetoEditando,
                    progresso: Number(
                      e.target.value
                    ),
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="delete-button"
                onClick={() =>
                  setProjetoEditando(null)
                }
              >
                Cancelar
              </button>

              <button
                className="primary-button"
                onClick={salvarEdicao}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projetos;