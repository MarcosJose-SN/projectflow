# ProjectFlow

Sistema web para gerenciamento de projetos e tarefas.

Desenvolvi o ProjectFlow para organizar projetos, acompanhar tarefas e visualizar o andamento das atividades em um único sistema.

A aplicação possui frontend em React + TypeScript, backend desenvolvido em Go e banco de dados PostgreSQL. Todo o ambiente pode ser executado utilizando Docker Compose.

## Funcionalidades

- Dashboard com visão geral do sistema
- Cadastro, edição e exclusão de projetos
- Cadastro, edição e exclusão de tarefas
- Definição de status e prioridade
- Associação de tarefas aos projetos
- Controle de progresso dos projetos
- Relatórios
- Exportação dos dados em CSV
- Interface responsiva
- Persistência dos dados no PostgreSQL

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- React Router
- Vite
- CSS

### Backend

- Go
- REST API
- PostgreSQL
- SQL

### Infraestrutura

- Docker
- Docker Compose
- Nginx

### Versionamento

- Git
- GitHub

## Estrutura

```text
projectflow/
├── backend/
│   ├── handlers/
│   ├── models/
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   └── main.go
│
├── database/
│   └── init.sql
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Como executar

### Pré-requisitos

- Docker Desktop
- Git

### Clonar o projeto

```bash
git clone https://github.com/MarcosJose-SN/projectflow.git
cd projectflow
```

### Executar

```bash
docker compose up -d --build
```

Depois, acesse:

**Frontend**

```text
http://localhost:5173
```

**Backend**

```text
http://localhost:8081
```

## API

### Projetos

```http
GET    /projetos
POST   /projetos
PUT    /projetos/{id}
DELETE /projetos/{id}
```

### Tarefas

```http
GET    /tarefas
POST   /tarefas
PUT    /tarefas/{id}
DELETE /tarefas/{id}
```

## Banco de dados

O sistema utiliza PostgreSQL.

As tabelas são criadas automaticamente a partir do arquivo:

```text
database/init.sql
```

Principais entidades:

- Projetos
- Tarefas

As tarefas possuem relacionamento com os projetos.

## Docker

O projeto utiliza três serviços principais:

```text
Frontend
   │
   ▼
Backend Go
   │
   ▼
PostgreSQL
```

O `docker-compose.yml` configura os serviços, portas, rede e volume utilizado pelo banco de dados.

## O que pratiquei neste projeto

Durante o desenvolvimento, trabalhei com:

- Desenvolvimento de uma API REST em Go
- Integração entre React e API
- Operações CRUD
- Modelagem de banco de dados
- Consultas SQL
- Integração com PostgreSQL
- Dockerização da aplicação
- Docker Compose
- Organização de frontend e backend
- Versionamento com Git e GitHub

## Autor

**Marcos José**

Professor de Computação e Desenvolvedor

Atuação e interesse em:

- Desenvolvimento Web
- Backend
- Jogos Digitais
- Inteligência Artificial
- Tecnologia Educacional

GitHub:  
https://github.com/MarcosJose-SN

LinkedIn:  
https://www.linkedin.com/in/marcos-jose-380915389/
