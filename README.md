# 🌀 HabitFlow API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)

> **API RESTful para criação e acompanhamento de hábitos diários.**  
> Projeto desenvolvido para praticar **Node.js**, **Express**, e **MongoDB**.  
> O objetivo é construir um backend completo que permita gerenciar hábitos, registrar o progresso diário e visualizar estatísticas de consistência.

---

## 🧩 Visão Geral

O **HabitFlow API** permite ao usuário:

- Criar e gerenciar hábitos pessoais (ex.: “Estudar”, “Beber água”, “Fazer exercícios”);
- Marcar quando um hábito foi cumprido no dia;
- Visualizar o histórico de hábitos completados;
- Calcular a sequência atual (“streak”) e total de dias realizados.

Este projeto é ideal para aprender:
- Estrutura de rotas no Express;
- CRUD com MongoDB e Mongoose;
- Relações simples (1 usuário → vários hábitos);
- Middlewares e boas práticas de API;
- Uso de variáveis de ambiente (`dotenv`);
- Tratamento de erros e status HTTP.

---

## ⚙️ Stack Tecnológica

| Tecnologia | Função |
|-------------|--------|
| **Node.js** | Ambiente de execução JavaScript |
| **Express.js** | Framework para criação da API |
| **MongoDB + Mongoose** | Banco de dados NoSQL e ODM |
| **Nodemon** | Atualiza o servidor automaticamente |
| **Dotenv** | Configuração de variáveis de ambiente |
| **Cors** | Permite acesso entre origens diferentes |
| **Express-async-errors** | Tratamento automático de erros async |

---

## 🧱 Arquitetura do Projeto
habitflow-api/
│
├── src/
│ ├── config/
│ │ └── db.js # Conexão com o banco de dados
│ ├── controllers/
│ │ ├── habitController.js # Regras de negócio dos hábitos
│ │ └── logController.js # Controle de registros diários
│ ├── models/
│ │ ├── habitModel.js # Schema de hábito
│ │ └── logModel.js # Schema de registro diário
│ ├── routes/
│ │ ├── habitRoutes.js
│ │ └── logRoutes.js
│ ├── middlewares/
│ │ └── errorHandler.js
│ ├── app.js # Configuração principal do Express
│ └── server.js # Inicialização do servidor
│
├── .env
├── .gitignore
├── package.json
└── README.md


---

## 📦 Dependências

### Instalação
```bash
npm init -y
npm install express mongoose dotenv cors express-async-errors
npm install --save-dev nodemon
```

### Scripts no package.json
```bash
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
```

## 🔒 Variáveis de Ambiente
Crie um arquivo .env na raiz com:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/habitflow
```

## 🌍 Endpoints da API

| Método | Endpoint | Descrição |
|--------|-----------|------------|
| **POST** | `/api/habits` | Criar um novo hábito |
| **GET** | `/api/habits` | Listar todos os hábitos |
| **GET** | `/api/habits/:id` | Buscar um hábito específico |
| **PUT** | `/api/habits/:id` | Atualizar um hábito |
| **DELETE** | `/api/habits/:id` | Deletar um hábito |
| **POST** | `/api/logs/:habitId` | Marcar hábito como concluído no dia |
| **GET** | `/api/logs/:habitId` | Buscar histórico de um hábito |
| **GET** | `/api/logs/:habitId/streak` | Calcular sequência atual do hábito |

---

## 🧠 Casos de Uso

### 🟢 1. Criar um novo hábito
O usuário cria um hábito definindo:
- **Nome:** obrigatório  
- **Descrição:** opcional  
- **Meta de frequência:** (ex.: “diário”, “3x por semana”)

---

### 🟡 2. Marcar um hábito como feito
Cada vez que o usuário cumpre um hábito, ele faz um `POST /api/logs/:habitId`.  
A API cria um registro no histórico com a **data atual**.

---

### 🔵 3. Consultar histórico de um hábito
Permite visualizar todos os dias em que o hábito foi concluído.

---

### 🟣 4. Calcular streak
A API retorna o número de **dias consecutivos** que o hábito foi cumprido.

---

## 🧩 Modelos de Dados

### 🪴 Habit

```json
{
  "_id": "ObjectId",
  "name": "Estudar Node.js",
  "description": "Ler documentação e praticar APIs",
  "frequency": "daily",
  "createdAt": "2025-10-28T12:00:00Z",
  "updatedAt": "2025-10-28T12:00:00Z"
}
```

# 🧮 Lógicas de Negócio

## ✅ Criar Hábito
* Recebe `name`, `description`, `frequency`.
* Retorna o hábito criado.

## 🔁 Marcar Hábito
* Verifica se o hábito já foi marcado na **data atual**.
* Se sim, retorna **erro 400 (Bad Request)**.
* Se não, cria um novo registro no histórico.

## 📈 Calcular Streak
* Busca todos os registros (`logs`) do hábito ordenados por data.
* Conta quantos dias **consecutivos** (incluindo hoje) o hábito foi cumprido.

---

# 💬 Exemplos de Requisições

### ➕ Criar hábito

**Requisição**
```http
POST /api/habits
Content-Type: application/json

{
  "name": "Estudar Node.js",
  "description": "Ler documentação e praticar APIs"
}
```
**Resposta 201:**
```json
{
  "_id": "672f...",
  "name": "Estudar Node.js",
  "description": "Ler documentação e praticar APIs",
  "frequency": "daily",
  "createdAt": "2025-10-28T12:00:00Z"
}
```
**✅ Marcar hábito como feito**
```http
POST /api/logs/672f...
```
**Resposta 201:**
```json
{
  "_id": "6730...",
  "habitId": "672f...",
  "date": "2025-10-28T00:00:00Z"
}
```
**📅 Consultar streak**
```http
GET /api/logs/672f.../streak
```
**Resposta 200:**
```json
{
  "habitId": "672f...",
  "currentStreak": 5
}
```

# 💡 Como Rodar o Projeto Localmente

### 1️⃣ Clonar o repositório
```bash
git clone [https://github.com/seuusuario/habitflow-api.git](https://github.com/seuusuario/habitflow-api.git)
```

### 2️⃣ Entrar na pasta
```bash
cd habitflow-api
```

### 3️⃣ Instalar dependências
```bash
npm install
```

### 4️⃣ Criar o arquivo .env
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/habitflow
```

### 5️⃣ Rodar servidor
```bash
npm run dev
```

# 🧾 Licença

Este projeto é **livre para uso educacional e aprendizado**.

Sinta-se à vontade para modificar e publicar seu próprio HabitFlow API no GitHub.


