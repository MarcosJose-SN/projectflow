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

interface TarefaApi {
  id: number;
  titulo: string;
  descricao: string;
  projeto_id: number;
  responsavel: string;
  prioridade: string;
  prazo: string;
  status: string;
}

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  projeto: string;
  responsavel: string;
  prioridade: string;
  prazo: string;
  status: string;
}

function Dashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [respostaProjetos, respostaTarefas] =
        await Promise.all([
          fetch("http://localhost:8081/projetos"),
          fetch("http://localhost:8081/tarefas"),
        ]);

      if (!respostaProjetos.ok) {
        throw new Error("Erro ao buscar projetos");
      }

      if (!respostaTarefas.ok) {
        throw new Error("Erro ao buscar tarefas");
      }

      const dadosProjetos: Projeto[] =
        await respostaProjetos.json();

      const dadosTarefas: TarefaApi[] =
        await respostaTarefas.json();

      const tarefasFormatadas: Tarefa[] =
        dadosTarefas.map((tarefa) => {
          const projeto = dadosProjetos.find(
            (projeto) => projeto.id === tarefa.projeto_id
          );

          return {
            id: tarefa.id,
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            projeto: projeto
              ? projeto.nome
              : "Projeto não definido",
            responsavel: tarefa.responsavel,
            prioridade: tarefa.prioridade,
            prazo: tarefa.prazo,
            status: tarefa.status,
          };
        });

      setProjetos(dadosProjetos);
      setTarefas(tarefasFormatadas);
    } catch (erro) {
      console.error(
        "Erro ao carregar dados do Dashboard:",
        erro
      );
    }
  }

  const tarefasEmAndamento = tarefas.filter(
    (tarefa) => tarefa.status === "Em andamento"
  ).length;

  const tarefasConcluidas = tarefas.filter(
    (tarefa) => tarefa.status === "Concluída"
  ).length;

  const progressoGeral =
    projetos.length > 0
      ? Math.round(
          projetos.reduce(
            (total, projeto) =>
              total + projeto.progresso,
            0
          ) / projetos.length
        )
      : 0;

  const projetosRecentes = projetos
    .slice(-3)
    .reverse();

  const tarefasRecentes = tarefas
    .slice(-3)
    .reverse();

  return (
    <main className="dashboard">

      {/* CABEÇALHO */}

      <section className="dashboard-header">

        <div>
          <h2>Olá, Marcos 👋</h2>

          <p>
            Aqui está o resumo dos seus projetos e tarefas.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            (window.location.href = "/projetos")
          }
        >
          + Novo projeto
        </button>

      </section>


      {/* ESTATÍSTICAS */}

      <section className="stats">

        <div className="stat-card">

          <span>Projetos</span>

          <strong>
            {projetos.length}
          </strong>

          <small>
            Projetos cadastrados
          </small>

        </div>


        <div className="stat-card">

          <span>Tarefas</span>

          <strong>
            {tarefas.length}
          </strong>

          <small>
            Total de tarefas
          </small>

        </div>


        <div className="stat-card">

          <span>Em andamento</span>

          <strong>
            {tarefasEmAndamento}
          </strong>

          <small>
            Tarefas em andamento
          </small>

        </div>


        <div className="stat-card">

          <span>Concluídas</span>

          <strong>
            {tarefasConcluidas}
          </strong>

          <small>
            Tarefas concluídas
          </small>

        </div>

      </section>


      {/* PROJETOS + PROGRESSO */}

      <section className="content-grid">

        {/* PROJETOS RECENTES */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>Projetos recentes</h2>

              <p>
                Acompanhe seus projetos ativos.
              </p>

            </div>

          </div>


          <div className="project-list">

            {projetosRecentes.length === 0 ? (

              <p>
                Nenhum projeto cadastrado.
              </p>

            ) : (

              projetosRecentes.map((projeto) => (

                <div
                  className="project-item"
                  key={projeto.id}
                >

                  <div>

                    <strong>
                      {projeto.nome}
                    </strong>

                    <span>
                      {projeto.descricao ||
                        "Sem descrição."}
                    </span>

                  </div>


                  <span
                    className={`status ${
                      projeto.status ===
                      "Concluído"
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

              ))

            )}

          </div>

        </div>


        {/* PROGRESSO */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>Progresso geral</h2>

              <p>
                Desempenho dos projetos.
              </p>

            </div>

          </div>


          <div className="progress-overview">

            <div className="progress-circle">

              <strong>
                {progressoGeral}%
              </strong>

              <span>
                Concluído
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* TAREFAS */}

      <section className="panel tasks-panel">

        <div className="panel-header">

          <div>

            <h2>Tarefas recentes</h2>

            <p>
              Últimas atividades do sistema.
            </p>

          </div>

        </div>


        {tarefasRecentes.length === 0 ? (

          <p>
            Nenhuma tarefa cadastrada.
          </p>

        ) : (

          tarefasRecentes.map((tarefa) => (

            <div
              className="task-row"
              key={tarefa.id}
            >

              <span
                className={`task-check ${
                  tarefa.status === "Concluída"
                    ? ""
                    : "pending-check"
                }`}
              >
                {tarefa.status === "Concluída"
                  ? "✓"
                  : "!"}
              </span>


              <div>

                <strong>
                  {tarefa.titulo}
                </strong>

                <small>
                  {tarefa.projeto}
                </small>

              </div>


              <span
                className={`status ${
                  tarefa.status === "Concluída"
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

          ))

        )}

      </section>

    </main>
  );
}

export default Dashboard;