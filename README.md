# GasControl Frontend

Sistema completo de gerenciamento de gasômetros desenvolvido em Next.js com TypeScript, integrado ao backend Django REST Framework.

## 🚀 Funcionalidades

### ✅ Autenticação
- Login/logout com JWT
- Proteção de rotas privadas
- Persistência de sessão
- Interceptors para renovação automática de tokens

### ✅ Dashboard
- KPIs em tempo real (total de gasômetros, leituras no período, média diária, alertas ativos)
- Gráficos de consumo com Recharts
- Filtros por período (7 dias, 30 dias, mês atual, personalizado)
- Interface responsiva e moderna

### ✅ CRUD de Gasômetros
- Lista paginada com busca e filtros
- Formulários com validação completa
- Status: ativo, inativo, manutenção
- Filtros por status, localização e busca textual

### ✅ Sistema de Leituras
- Registro de leituras com validações avançadas
- Validação de valores negativos e datas futuras
- Alertas para consumo atípico (>200% da média)
- Histórico com filtros e exportação CSV
- Gráficos de consumo por gasômetro

### ✅ Sistema de Alertas
- Lista de alertas com filtros por status e tipo
- Mudança de status (novo → em análise → resolvido)
- Tipos: pico de consumo, medidor inativo, falha de leitura, consumo zero
- Estatísticas de alertas no dashboard

### ✅ Testes
- Testes unitários com Jest e Testing Library
- Testes E2E com Playwright
- Cobertura de validações e fluxos principais

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **HTTP**: Axios com interceptors
- **Testes**: Jest, Testing Library, Playwright
- **Qualidade**: ESLint, Prettier

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend GasControl rodando (veja instruções abaixo)

## 🚀 Instalação e Execução

### 1. Clone e configure o backend

\`\`\`bash
# Clone o repositório do backend
git clone https://github.com/resorgatto/gascontrol.git
cd gascontrol

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser
# Username: admin
# Password: admin123

# Execute o servidor
python manage.py runserver
\`\`\`

O backend estará disponível em `http://localhost:8000`

### 2. Configure o frontend

\`\`\`bash
# Clone este repositório (ou use o código gerado)
# cd gascontrol-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em modo de desenvolvimento
npm run dev
\`\`\`

O frontend estará disponível em `http://localhost:3000`

### 3. Variáveis de Ambiente

Crie o arquivo `.env.local`:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Development
NODE_ENV=development
\`\`\`

## 🧪 Testes

### Testes Unitários
\`\`\`bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm test -- --coverage
\`\`\`

### Testes E2E
\`\`\`bash
# Executar testes E2E
npm run test:e2e

# Executar com interface gráfica
npm run test:e2e:ui
\`\`\`

## 📊 Estrutura do Projeto

\`\`\`
gascontrol-frontend/
├── app/                    # App Router (Next.js 14)
│   ├── dashboard/         # Dashboard principal
│   ├── gasometers/        # CRUD de gasômetros
│   ├── readings/          # Sistema de leituras
│   ├── alerts/            # Sistema de alertas
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── auth/             # Componentes de autenticação
│   ├── dashboard/        # Componentes do dashboard
│   ├── gasometers/       # Componentes de gasômetros
│   ├── readings/         # Componentes de leituras
│   ├── alerts/           # Componentes de alertas
│   └── layout/           # Layout e navegação
├── lib/                  # Utilitários e configurações
│   ├── api.ts           # Cliente HTTP (Axios)
│   ├── utils.ts         # Funções utilitárias
│   └── services/        # Serviços de API
├── store/               # Estado global (Zustand)
├── types/               # Definições TypeScript
├── __tests__/           # Testes unitários
└── e2e/                 # Testes E2E (Playwright)
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm test             # Testes unitários
npm run test:e2e     # Testes E2E
\`\`\`

## 🎯 Fluxos Principais

### 1. Autenticação
1. Acesse `/login`
2. Use as credenciais: `admin` / `admin123`
3. Será redirecionado para `/dashboard`

### 2. Registro de Leitura (Fluxo E2E testado)
1. Navegue para "Leituras"
2. Clique em "Nova Leitura"
3. Selecione um gasômetro
4. Preencha data/hora e consumo
5. Adicione observações (opcional)
6. Clique em "Salvar Leitura"

### 3. Gerenciamento de Alertas
1. Navegue para "Alertas"
2. Visualize alertas por status/tipo
3. Altere status conforme necessário
4. Visualize detalhes clicando no ícone de olho

## 🔍 Validações Implementadas

### Leituras
- ❌ Valores negativos
- ❌ Datas futuras
- ⚠️ Consumo >200% da média (warning)
- ✅ Decimais permitidos
- ✅ Campos obrigatórios

### Gasômetros
- ✅ Identificador único
- ✅ Descrição obrigatória
- ✅ Status válido
- ✅ Localização obrigatória

## 🎨 Design System

- **Cores**: Tema escuro profissional com verde como cor primária
- **Tipografia**: Inter (sistema)
- **Componentes**: shadcn/ui customizados
- **Responsividade**: Mobile-first
- **Acessibilidade**: Labels, roles e foco adequados

## 📱 Responsividade

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)
- ✅ Menu lateral colapsível
- ✅ Tabelas com scroll horizontal

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no Vercel
2. Configure a variável `NEXT_PUBLIC_API_BASE_URL`
3. Deploy automático

### Build Manual
\`\`\`bash
npm run build
npm start
\`\`\`

## 🐛 Troubleshooting

### Backend não conecta
- Verifique se o backend está rodando em `http://localhost:8000`
- Confirme as variáveis de ambiente
- Verifique CORS no backend Django

### Erro de autenticação
- Limpe localStorage: `localStorage.clear()`
- Verifique credenciais: `admin` / `admin123`
- Confirme se o superusuário foi criado no backend

### Testes falhando
- Execute `npm install` novamente
- Verifique se o backend está rodando para testes E2E
- Limpe cache: `npm run build && rm -rf .next`

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
