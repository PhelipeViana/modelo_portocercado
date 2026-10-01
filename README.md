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
go run ./cmd/server
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

## Notícias e backup dos dados

O painel administrativo grava notícias e rascunhos no PostgreSQL. As rotas públicas `/api/articles` e `/api/articles/:slug` expõem somente notícias publicadas; o endpoint administrativo `GET /api/admin/articles` requer JWT e retorna também rascunhos. O CRUD administrativo usa `POST`, `PUT` e `DELETE /api/articles[/:id]`.

O serviço `database-backup` gera automaticamente dumps compactados diariamente em `./backups` e mantém 14 dias. Configure `BACKUP_INTERVAL_SECONDS` e `BACKUP_RETENTION_DAYS` no `.env` para ajustar o ciclo e a retenção. Verifique os arquivos com:

```bash
docker compose logs database-backup
ls -lh backups/
```

Para gerar um backup manual:

```bash
docker compose exec database-backup sh /usr/local/bin/database-backup.sh once
```

Para importar um arquivo `.sql.gz` no banco:

```bash
gunzip -c backups/ARQUIVO.sql.gz | docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

O diretório `backups/` fica fora do volume do banco e não é versionado. Mantenha uma cópia fora da máquina para recuperação contra falha do host.

## Imagens e vídeos nas notícias

No editor de notícias, selecione **Enviar e recortar imagem** para gerar uma capa 16:9 e salvar o arquivo no storage do sistema. No Docker, os arquivos ficam no volume `portocercado2_uploads`; eles continuam disponíveis após recriar o container. Em execução local, o padrão é `backend/storage/uploads` e pode ser alterado com `UPLOADS_DIR`.

Para uma notícia em vídeo, informe a URL do YouTube. O sistema detecta links `youtu.be`, `watch`, `shorts` e `embed`, preenche a capa a partir do YouTube e mostra o player na página pública da notícia.
