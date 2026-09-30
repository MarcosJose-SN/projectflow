CREATE TABLE IF NOT EXISTS projetos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média',
    prazo DATE,
    responsavel VARCHAR(150),
    progresso INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    projeto_id INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
    responsavel VARCHAR(150),
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média',
    prazo DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);