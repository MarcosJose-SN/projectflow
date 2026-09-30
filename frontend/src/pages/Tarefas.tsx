import { useEffect, useState } from "react";

interface Projeto {
  id: number;
  nome: string;
}

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  projeto_id: number;
  responsavel: string;
  prioridade: string;
  prazo: string;
  status: string;
}

function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [projetoId, setProjetoId] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [prazo, setPrazo] = useState("");
  const [status, setStatus] = useState("Pendente");

  const [tarefaEditando, setTarefaEditando] =
    useState<Tarefa | null>(null);

  useEffect(() => {
    carregarTarefas();
    carregarProjetos();
  }, []);

  async function carregarTarefas() {
    try {
      const resposta = await fetch(
        "http://localhost:8081/tarefas"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar tarefas");
      }

      const dados = await resposta.json();
      setTarefas(dados);
    } catch (erro) {
      console.error("Erro ao carregar tarefas:", erro);
    }
  }

  async function carregarProjetos() {
    try {
      const resposta = await fetch(
        "http://localhost:8081/projetos"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar projetos");
      }

      const dados = await resposta.json();

      setProjetos(
        dados.map((projeto: Projeto) => ({
          id: projeto.id,
          nome: projeto.nome,
        }))
      );
    } catch (erro) {
      console.error("Erro ao carregar projetos:", erro);
    }
  }

  function limparFormulario() {
    setTitulo("");
    setDescricao("");
    setProjetoId("");
    setResponsavel("");
    setPrioridade("Média");
    setPrazo("");
    setStatus("Pendente");
  }

  async function adicionarTarefa() {
    if (!titulo.trim()) {
      alert("Digite o título da tarefa.");
      return;
    }

    if (!projetoId) {
      alert("Selecione um projeto.");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:8081/tarefas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            projeto_id: Number(projetoId),
            responsavel: responsavel.trim(),
            prioridade,
            prazo,
            status,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar tarefa");
      }

      const novaTarefa = await resposta.json();

      setTarefas((tarefasAtuais) => [
        ...tarefasAtuais,
        novaTarefa,
      ]);

      limparFormulario();
    } catch (erro) {
      console.error("Erro ao cadastrar tarefa:", erro);
      alert("Não foi possível cadastrar a tarefa.");
    }
  }

  async function excluirTarefa(id: number) {
    try {
      const resposta = await fetch(
        "http://localhost:8081/tarefas",
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
        throw new Error("Erro ao excluir tarefa");
      }

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter(
          (tarefa) => tarefa.id !== id
        )
      );
    } catch (erro) {
      console.error("Erro ao excluir tarefa:", erro);
      alert("Não foi possível excluir a tarefa.");
    }
  }

  function abrirEdicao(id: number) {
    const tarefa = tarefas.find(
      (tarefa) => tarefa.id === id
    );

    if (!tarefa) {
      return;
    }

    setTarefaEditando(tarefa);
  }

  async function salvarEdicao() {
    if (!tarefaEditando) {
      return;
    }

    if (!tarefaEditando.titulo.trim()) {
      alert("Digite o título da tarefa.");
      return;
    }

    if (!tarefaEditando.projeto_id) {
      alert("Selecione um projeto.");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:8081/tarefas",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...tarefaEditando,
            titulo: tarefaEditando.titulo.trim(),
            descricao: tarefaEditando.descricao.trim(),
            responsavel:
              tarefaEditando.responsavel.trim(),
            projeto_id: Number(
              tarefaEditando.projeto_id
            ),
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      const tarefaAtualizada =
        await resposta.json();

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefa) =>
          tarefa.id === tarefaEditando.id
            ? tarefaAtualizada
            : tarefa
        )
      );

      setTarefaEditando(null);
    } catch (erro) {
      console.error(
        "Erro ao atualizar tarefa:",
        erro
      );

      alert(
        "Não foi possível atualizar a tarefa."
      );
    }
  }

  function nomeProjeto(projetoId: number) {
    const projeto = projetos.find(
      (projeto) => projeto.id === projetoId
    );

    return projeto?.nome || "Projeto não definido";
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
          <h2>Tarefas</h2>

          <p>
            Organize e acompanhe as tarefas dos seus
            projetos.
          </p>
        </div>

      </div>


      {/* NOVA TAREFA */}

      <div className="panel project-form">

        <h2>Nova tarefa</h2>

        <div className="form-grid">

          <input
            type="text"
            placeholder="Título da tarefa"
            value={titulo}
            onChange={(e) =>
              setTitulo(e.target.value)
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
            value={projetoId}
            onChange={(e) =>
              setProjetoId(e.target.value)
            }
          >

            <option value="">
              Selecione o projeto
            </option>

            {projetos.map((projeto) => (

              <option
                key={projeto.id}
                value={projeto.id}
              >
                {projeto.nome}
              </option>

            ))}

          </select>


          <input
            type="text"
            placeholder="Responsável"
            value={responsavel}
            onChange={(e) =>
              setResponsavel(e.target.value)
            }
          />


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

            <option value="Concluída">
              Concluída
            </option>

          </select>


          <input
            type="date"
            value={prazo}
            onChange={(e) =>
              setPrazo(e.target.value)
            }
          />


          <button
            className="primary-button"
            onClick={adicionarTarefa}
          >
            + Adicionar tarefa
          </button>

        </div>

      </div>


      {/* LISTA DE TAREFAS */}

      <div className="projects-grid">

        {tarefas.map((tarefa) => (

          <article
            className="panel project-card"
            key={tarefa.id}
          >

            <div className="project-card-header">

              <div>

                <h2>
                  {tarefa.titulo}
                </h2>

                <p>
                  {tarefa.descricao ||
                    "Sem descrição."}
                </p>

              </div>


              <span
                className={`status ${
                  tarefa.status ===
                  "Concluída"
                    ? "done"
                    : tarefa.status ===
                      "Em andamento"
                    ? "progress"
                    : "pending"
                }`}
              >
                {tarefa.status}
              </span>

            </div>


            <div className="project-details">

              <div className="project-priority">

                <span>
                  Prioridade
                </span>

                <strong>
                  {tarefa.prioridade}
                </strong>

              </div>


              <div>

                <span>
                  Projeto
                </span>

                <strong>
                  {nomeProjeto(
                    tarefa.projeto_id
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Prazo
                </span>

                <strong>
                  {formatarPrazo(
                    tarefa.prazo
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Responsável
                </span>

                <strong>
                  {tarefa.responsavel ||
                    "Não definido"}
                </strong>

              </div>

            </div>


            <div className="project-actions">

              <button
                className="edit-button"
                onClick={() =>
                  abrirEdicao(tarefa.id)
                }
              >
                Editar tarefa
              </button>


              <button
                className="delete-button"
                onClick={() =>
                  excluirTarefa(tarefa.id)
                }
              >
                Excluir tarefa
              </button>

            </div>

          </article>

        ))}

      </div>


      {/* MODAL DE EDIÇÃO */}

      {tarefaEditando && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  Editar tarefa
                </h2>

                <p>
                  Atualize as informações da tarefa.
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setTarefaEditando(null)
                }
              >
                ×
              </button>

            </div>


            <div className="form-grid">

              <input
                type="text"
                placeholder="Título da tarefa"
                value={
                  tarefaEditando.titulo
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    titulo:
                      e.target.value,
                  })
                }
              />


              <input
                type="text"
                placeholder="Descrição"
                value={
                  tarefaEditando.descricao
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    descricao:
                      e.target.value,
                  })
                }
              />


              <select
                value={
                  tarefaEditando.projeto_id
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    projeto_id:
                      Number(
                        e.target.value
                      ),
                  })
                }
              >

                <option value={0}>
                  Selecione o projeto
                </option>

                {projetos.map(
                  (projeto) => (

                    <option
                      key={projeto.id}
                      value={projeto.id}
                    >
                      {projeto.nome}
                    </option>

                  )
                )}

              </select>


              <input
                type="text"
                placeholder="Responsável"
                value={
                  tarefaEditando.responsavel
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    responsavel:
                      e.target.value,
                  })
                }
              />


              <select
                value={
                  tarefaEditando.prioridade
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
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


              <select
                value={
                  tarefaEditando.status
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    status:
                      e.target.value,
                  })
                }
              >

                <option value="Pendente">
                  Pendente
                </option>

                <option value="Em andamento">
                  Em andamento
                </option>

                <option value="Concluída">
                  Concluída
                </option>

              </select>


              <input
                type="date"
                value={
                  tarefaEditando.prazo
                }
                onChange={(e) =>
                  setTarefaEditando({
                    ...tarefaEditando,
                    prazo:
                      e.target.value,
                  })
                }
              />

            </div>


            <div className="modal-actions">

              <button
                className="delete-button"
                onClick={() =>
                  setTarefaEditando(null)
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

export default Tarefas;