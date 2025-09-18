# MedCo Test - Aplicação de Gerenciamento de Tarefas

Uma aplicação full-stack de gerenciamento de tarefas construída com React, TypeScript, Node.js e Prisma.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Sistema seguro de login/registro com tokens JWT
- **Gerenciamento de Tarefas**: Criar, ler, atualizar e excluir tarefas
- **Filtragem de Tarefas**: Filtrar tarefas por status (PENDENTE, EM_ANDAMENTO, CONCLUÍDA)
- **Paginação**: Paginação eficiente de tarefas com tamanhos de página personalizáveis
- **Ordenação de Tarefas**: Ordenar tarefas por data de criação, data de expiração, título ou status
- **Design Responsivo**: Interface moderna com Tailwind CSS
- **Segurança**: Prevenção de ataques de timing e autenticação segura

## 🏗️ Estrutura do Projeto

```
medco_test/
├── backend/                    # API Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/        # Controladores de rotas
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── middleware/         # Middleware do Express
│   │   │   └── authMiddleware.ts
│   │   ├── services/           # Lógica de negócio
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── validators/         # Validação de entrada
│   │   │   ├── authValidator.ts
│   │   │   └── taskValidator.ts
│   │   └── __tests__/          # Testes unitários
│   ├── prisma/                 # Schema do banco e migrações
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── publicRoutes.ts         # Rotas públicas da API
│   ├── privateRoutes.ts        # Rotas protegidas da API
│   ├── index.ts               # Arquivo principal do servidor
│   └── package.json
├── frontend/                   # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── TableComponent.tsx
│   │   │   ├── PaginatorComponent.tsx
│   │   │   ├── TaskDetails.tsx
│   │   │   ├── TaskDetailsModal.tsx
│   │   │   └── TaskFilters.tsx
│   │   ├── pages/              # Componentes de página
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Tasks.tsx
│   │   │   └── CreateTask.tsx
│   │   ├── types/              # Definições de tipos TypeScript
│   │   │   └── task.ts
│   │   ├── AuthContext.tsx     # Contexto de autenticação
│   │   ├── api.ts             # Cliente da API
│   │   └── App.tsx            # Componente principal da aplicação
│   └── package.json
├── common/                     # Configuração compartilhada do Docker
│   └── docker-compose.yml
└── Makefile                   # Scripts de build e deploy
```

## 🛠️ Pré-requisitos

Antes de executar a aplicação, certifique-se de ter o seguinte instalado:

- **Docker Compose** (v2.39.1 ou superior)
- **Docker** (versão 28.3.3 ou superior)
- **Make** (versão 4.3 ou superior)
- As portas 3007 e 3008 livres, porém é possivel modifica-las para outras portas

## 📦 Instalação

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd medco_test
```

### 2. Subir os containers

```bash
make up-project
```

### 3. Esperar que a aplicação fique pronta

Para isso, basta esperar que o back-end esteja pronto: você pode verificar através
do comando

```bash
docker logs -n 100 -f backend
```

e esperar até que apareça a seguinte mensagem no terminal:
```
Backend listening on port 3007
```

## 🚀 Executando a Aplicação

O backend estará disponível em `http://localhost:3000`

O frontend estará disponível em `http://localhost:3008`

## 🧪 Testes

### Testes do Backend
```bash
cd backend
npm test
```

### Testes do Frontend
```bash
cd frontend
npm test
```

## 📊 Endpoints da API

### Rotas Públicas
- `GET /health` - Verificação de saúde
- `POST /register` - Registro de usuário
- `POST /login` - Login do usuário
- `POST /logout` - Logout do usuário

### Rotas Privadas (Requer Autenticação)
- `GET /me` - Obter informações do usuário atual
- `GET /tasks` - Obter tarefas do usuário (com filtragem e paginação)
- `POST /tasks` - Criar uma nova tarefa
- `PUT /tasks/:id` - Atualizar uma tarefa
- `DELETE /tasks/:id` - Excluir uma tarefa

### Parâmetros de Query para GET /tasks
- `status` - Filtrar por status (PENDING, IN_PROGRESS, COMPLETED)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `orderBy` - Campo de ordenação (expiration_date, title, status)
- `order` - Direção da ordenação (asc, desc)

## 🔧 Configuração
 Altere as portas de execução dos containeres no arquivo
 ```
 common/docker-compose.yml
 ```