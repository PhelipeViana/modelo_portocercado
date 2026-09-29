# Porto Cercado - Arquitetura Desacoplada (Frontend + Backend Go + Docker)

Este projeto foi reestruturado para uma arquitetura moderna e escalável, dividida em **Frontend** (React + Vite) e **Backend** (Golang REST API), totalmente orquestrados com **Docker & Docker Compose**.

---

## 📁 Estrutura do Projeto

```text
modelo_portocercado/
├── docker-compose.yml         # Orquestração de containers Docker
├── README.md                  # Documentação do projeto
├── frontend/                  # Aplicação React 19 + Vite + TypeScript + Tailwind CSS
│   ├── Dockerfile             # Container do Frontend (Porta 3000)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── services/api.ts    # Comunicação HTTP com a API Go
│       └── ...
└── backend/                   # API REST em Golang 1.24
    ├── Dockerfile             # Container Multi-stage do Backend Go (Porta 8080)
    ├── go.mod
    ├── main.go                # Servidor HTTP Principal
    ├── handlers/              # Endpoints & Middlewares CORS
    ├── models/                # Estruturas de dados (Articles, Events, Documents, etc)
    └── data/                  # Dados iniciais simulados
```

---

## 🚀 Como Executar com Docker (Recomendado)

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### 1. Iniciar todos os serviços

Na raiz do projeto (`modelo_portocercado/`), execute:

```bash
docker compose up --build
```

### 2. Acessar as aplicações

- 🌐 **Frontend (Interface Web):** [http://localhost:3150](http://localhost:3150)
- ⚙️ **Backend Go API:** [http://localhost:8088/api/health](http://localhost:8088/api/health)

### 3. Encerrar os containers

```bash
docker compose down
```

---

## 💻 Como Executar Localmente sem Docker (Desenvolvimento)

### Backend (Golang)

```bash
cd backend
go run main.go
```

A API estará rodando internamente ou via `http://localhost:8088`.

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

A interface estará rodando em `http://localhost:3000`.

---

## 🔌 Endpoints da API Go

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica a saúde do servidor Go |
| `GET` | `/api/articles` | Retorna a lista de artigos/notícias |
| `GET` | `/api/documents` | Retorna a lista de editais e atas |
| `GET` | `/api/events` | Retorna a agenda de eventos |
| `GET` | `/api/videos` | Retorna a lista de vídeos e episódios |
| `POST` | `/api/ai/chat` | Endpoint para interação com o Atendente IA |
