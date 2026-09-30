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

function Relatorios() {
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
            (projeto) =>
              projeto.id === tarefa.projeto_id
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
        "Erro ao carregar dados dos relatórios:",
        erro
      );
    }
  }

  const projetosEmAndamento = projetos.filter(
    (projeto) =>
      projeto.status === "Em andamento"
  ).length;

  const projetosConcluidos = projetos.filter(
    (projeto) =>
      projeto.status === "Concluído"
  ).length;

  const projetosPendentes = projetos.filter(
    (projeto) =>
      projeto.status === "Pendente"
  ).length;

  const tarefasEmAndamento = tarefas.filter(
    (tarefa) =>
      tarefa.status === "Em andamento"
  ).length;

  const tarefasConcluidas = tarefas.filter(
    (tarefa) =>
      tarefa.status === "Concluída"
  ).length;

  const tarefasAlta = tarefas.filter(
    (tarefa) =>
      tarefa.prioridade === "Alta"
  ).length;

  const tarefasMedia = tarefas.filter(
    (tarefa) =>
      tarefa.prioridade === "Média"
  ).length;

  const tarefasBaixa = tarefas.filter(
    (tarefa) =>
      tarefa.prioridade === "Baixa"
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

  const taxaTarefas =
    tarefas.length > 0
      ? Math.round(
          (tarefasConcluidas /
            tarefas.length) *
            100
        )
      : 0;

  function exportarRelatorio() {
    const conteudo = [
      ["RELATÓRIO PROJECTFLOW"],
      [""],
      ["INDICADORES"],
      ["Total de projetos", projetos.length],
      ["Total de tarefas", tarefas.length],
      ["Tarefas em andamento", tarefasEmAndamento],
      ["Tarefas concluídas", tarefasConcluidas],
      [""],
      ["STATUS DOS PROJETOS"],
      [
        "Projetos em andamento",
        projetosEmAndamento,
      ],
      [
        "Projetos concluídos",
        projetosConcluidos,
      ],
      [
        "Projetos pendentes",
        projetosPendentes,
      ],
      [""],
      ["PRIORIDADE DAS TAREFAS"],
      ["Alta", tarefasAlta],
      ["Média", tarefasMedia],
      ["Baixa", tarefasBaixa],
      [""],
      ["DESEMPENHO"],
      [
        "Progresso geral",
        `${progressoGeral}%`,
      ],
      [
        "Taxa de conclusão das tarefas",
        `${taxaTarefas}%`,
      ],
    ];

    const csv = conteudo
      .map((linha) =>
        linha
          .map(
            (valor) =>
              `"${String(valor).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(";")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "relatorio-projectflow.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <section className="reports-page">

      <div className="dashboard-header">

        <div>

          <h2>Relatórios</h2>

          <p>
            Acompanhe os principais indicadores dos seus
            projetos.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={exportarRelatorio}
        >
          Exportar relatório
        </button>

      </div>

      {/* INDICADORES */}

      <section className="stats">

        <div className="stat-card">

          <span>
            Total de projetos
          </span>

          <strong>
            {projetos.length}
          </strong>

          <small>
            Projetos cadastrados
          </small>

        </div>

        <div className="stat-card">

          <span>
            Total de tarefas
          </span>

          <strong>
            {tarefas.length}
          </strong>

          <small>
            Tarefas cadastradas
          </small>

        </div>

        <div className="stat-card">

          <span>
            Em andamento
          </span>

          <strong>
            {tarefasEmAndamento}
          </strong>

          <small>
            Tarefas em execução
          </small>

        </div>

        <div className="stat-card">

          <span>
            Concluídas
          </span>

          <strong>
            {tarefasConcluidas}
          </strong>

          <small>
            Tarefas finalizadas
          </small>

        </div>

      </section>

      {/* RESUMO */}

      <section className="content-grid">

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Status dos projetos
              </h2>

              <p>
                Distribuição atual dos projetos.
              </p>

            </div>

          </div>

          <div className="report-list">

            <div className="report-item">

              <div>

                <strong>
                  Em andamento
                </strong>

                <span>
                  Projetos em desenvolvimento
                </span>

              </div>

              <strong>
                {projetosEmAndamento}
              </strong>

            </div>

            <div className="report-item">

              <div>

                <strong>
                  Concluídos
                </strong>

                <span>
                  Projetos finalizados
                </span>

              </div>

              <strong>
                {projetosConcluidos}
              </strong>

            </div>

            <div className="report-item">

              <div>

                <strong>
                  Pendentes
                </strong>

                <span>
                  Projetos aguardando início
                </span>

              </div>

              <strong>
                {projetosPendentes}
              </strong>

            </div>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Prioridade das tarefas
              </h2>

              <p>
                Distribuição por prioridade.
              </p>

            </div>

          </div>

          <div className="report-list">

            <div className="report-item">

              <div>

                <strong>
                  Alta
                </strong>

                <span>
                  Tarefas prioritárias
                </span>

              </div>

              <strong>
                {tarefasAlta}
              </strong>

            </div>

            <div className="report-item">

              <div>

                <strong>
                  Média
                </strong>

                <span>
                  Tarefas de prioridade média
                </span>

              </div>

              <strong>
                {tarefasMedia}
              </strong>

            </div>

            <div className="report-item">

              <div>

                <strong>
                  Baixa
                </strong>

                <span>
                  Tarefas de baixa prioridade
                </span>

              </div>

              <strong>
                {tarefasBaixa}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* DESEMPENHO */}

      <section className="panel report-performance">

        <div className="panel-header">

          <div>

            <h2>
              Desempenho geral
            </h2>

            <p>
              Visão geral da execução dos projetos.
            </p>

          </div>

        </div>

        <div className="performance-content">

          <div className="progress-circle">

            <strong>
              {progressoGeral}%
            </strong>

            <span>
              Concluído
            </span>

          </div>

          <div className="performance-info">

            <div>

              <span>
                Projetos cadastrados
              </span>

              <strong>
                {projetos.length}
              </strong>

            </div>

            <div>

              <span>
                Tarefas concluídas
              </span>

              <strong>
                {tarefasConcluidas} de{" "}
                {tarefas.length}
              </strong>

            </div>

            <div>

              <span>
                Taxa de conclusão
              </span>

              <strong>
                {taxaTarefas}%
              </strong>

            </div>

          </div>

        </div>

      </section>

    </section>
  );
}

export default Relatorios;