# Projeto Backend IEL

Este é um projeto backend desenvolvido para o curso IEL com as seguintes funcionalidades:

- API RESTful para gerenciamento de usuários
- Autenticação JWT
- Banco de dados SQLite
- Modelos: Usuários, Categorias, Produtos

## Tecnologias utilizadas
- Node.js
- Express
- Sequelize (ORM)
- SQLite

## Como executar
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o arquivo `.env`
4. Inicie o servidor: `npm start`

## Rotas principais
- `/api/users` - Gerenciamento de usuários

## Como testar a API

### Opção 1: Interface Web
1. Acesse a interface frontend disponível no GitHub Pages: [https://janniofsantos.github.io/gtech2](https://janniofsantos.github.io/gtech2)
2. Certifique-se que o servidor backend está rodando localmente:
```bash
npm start
```
3. A interface se conectará automaticamente à API em `http://localhost:3001`

### Opção 2: Clientes HTTP
1. Certifique-se que o servidor está rodando:
```bash
npm start
```

2. Use um cliente HTTP para testar as rotas:

#### Exemplo com curl:
```bash
# Listar todos os usuários
curl http://localhost:3001/api/users

# Criar novo usuário
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Usuário","email":"novo@email.com","password":"senha123"}'

# Obter usuário por ID
curl http://localhost:3001/api/users/1
```

Ou utilize ferramentas como Postman ou Thunder Client (extensão do VSCode) para testar as requisições.

### Configuração do GitHub Pages
1. Acesse as configurações do repositório no GitHub
2. Vá em "Pages" no menu lateral
3. Selecione a branch `main` e a pasta `/frontend`
4. Salve as configurações
