# Dashboard de Vendas Front-End

Sistema web para gerenciamento de vendas desenvolvido com React, TypeScript e Vite, integrado a uma API em .NET e banco de dados PostgreSQL.

---

## Integrantes

- Ana Beatriz Dias Mendes

---

## Descrição do Projeto

O Dashboard de Vendas é uma aplicação full stack criada para auxiliar no controle de clientes, produtos e vendas de uma empresa.

O sistema permite:

- cadastro de clientes;
- cadastro de produtos;
- registro de vendas;
- cálculo automático do valor total da venda;
- visualização de dashboard com informações de vendas;
- consulta do histórico de vendas.

O projeto foi desenvolvido utilizando arquitetura separada entre frontend e backend:

- Frontend: React + TypeScript + Vite
- Backend: ASP.NET Core (.NET 10)
- Banco de Dados: PostgreSQL
- Testes Automatizados: xUnit

---

## Tecnologias Utilizadas

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Docker

### Testes

- xUnit

---

## Funcionalidades

### Clientes

- cadastrar cliente;
- listar clientes.

### Produtos

- cadastrar produto;
- listar produtos.

### Vendas

- registrar venda;
- adicionar itens à venda;
- calcular valor total automaticamente;
- listar histórico de vendas.

### Dashboard

- visualizar métricas de vendas;
- acompanhar informações gerais do sistema.

---

## Estrutura do Projeto

```bash
dashboardvendas-front/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── styles/
│   └── App.tsx
├── public/
├── package.json
└── vite.config.ts
```
##Integração com API

O frontend consome a API desenvolvida em .NET através de requisições HTTP utilizando Axios.

Endpoints utilizados
GET /clientes
POST /clientes

GET /produtos
POST /produtos

GET /vendas
POST /vendas

##Objetivo Acadêmico

Este projeto foi desenvolvido para fins acadêmicos com foco em:

- desenvolvimento full stack;
- integração frontend/backend;
- APIs REST;
- banco de dados relacional;
- modelagem UML.
