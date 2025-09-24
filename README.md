# GasControl - Frontend

> **Status do Projeto:** A interface do usuário (UI) para os principais recursos foi construída e está funcionando com dados mockados (simulados). A próxima fase é a integração com a API do backend.

Este é o repositório do frontend para o sistema GasControl, desenvolvido como um SPA (Single-Page Application) utilizando React, Vite e TypeScript.

![Login](./login.png)
![Dashboards](./dashboards.png)
![Gasômetros](./gasometros.png)
![Alertas](./alertas.png)


## ✨ Funcionalidades (UI Implementada)

Esta é a lista de funcionalidades exigidas, com o status atual de implementação da interface.

-   **Autenticação**
    -   [x] Tela de Login
    -   [ ] Persistência de sessão e proteção de rotas (lógica pendente)
-   **Dashboard**
    -   [x] Cards/resumos para KPIs (total de gasômetros, alertas ativos, etc)
    -   [x] Espaço reservado para Gráfico de consumo
-   **Gasômetros (CRUD)**
    -   [x] Lista paginada
    -   [ ] Formulários de Criar/Editar/Deletar (UI e lógica pendentes)
-   **Leituras**
    -   [ ] Formulário de Registro de Leitura (UI e lógica pendentes)
    -   [ ] Tabela de Histórico de leituras (UI e lógica pendentes)
-   **Alertas**
    -   [x] Lista de alertas com status
    -   [ ] Lógica para mudança de status (pendente)

## 🛠️ Tecnologias Utilizadas

-   **Framework:** React (com Vite)
-   **Linguagem:** TypeScript
-   **Estilização:** Tailwind CSS & shadcn/ui
-   **Roteamento:** React Router DOM
-   **Gerenciamento de Estado:** Zustand
-   **Formulários:** React Hook Form & Zod (a ser implementado)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação frontend em modo de desenvolvimento.

### Pré-requisitos
-   Node.js (v18 ou superior)
-   Git

### Passos de Execução

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/renanfrontend/gascontrol-frontend.git](https://github.com/renanfrontend/gascontrol-frontend.git)
    cd gascontrol-frontend
    ```

2.  **Crie o arquivo de ambiente:**
    Copie o arquivo de exemplo `.env.example` para `.env`. Este arquivo será usado futuramente para a integração com a API.
    ```bash
    cp .env.example .env
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

### Variáveis de Ambiente

Crie um arquivo `.env.example` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila o projeto para produção.
-   `npm run lint`: Executa o linter para análise de código.

## 📝 Licença

Este projeto é licenciado sob a Licença MIT.

Copyright (c) 2025 Desenvolvido por - Renan Augusto dos Santos.