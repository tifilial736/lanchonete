# 🍔 Snacks Chicken - Sistema de Pedidos Online

Sistema completo de pedidos online para hamburgueria com painel administrativo e integração PIX.

## ✨ Funcionalidades

### Cliente
- 📱 Interface responsiva e moderna
- 🍔 Catálogo de produtos com categorias (Hambúrgueres e Combos)
- 🛒 Carrinho de compras com persistência local
- 💳 Sistema de pagamento PIX com desconto de 5%
- 📝 Formulário de pedidos com dados do cliente
- 🎨 Design inspirado no cardápio fornecido

### Administrador
- 🔐 Autenticação via Replit Auth
- ➕ Criação, edição e exclusão de produtos
- 📊 Dashboard com estatísticas em tempo real
- 📈 Visualização de pedidos e receita
- 🎛️ Controle de status dos produtos

### Técnico
- ⚡ React + TypeScript + Vite
- 🗃️ PostgreSQL com Drizzle ORM
- 🎨 TailwindCSS + Shadcn/UI
- 🔒 Autenticação segura
- 📱 Design mobile-first

## 🚀 Configuração para Desenvolvimento

### Pré-requisitos

- Node.js 20+
- PostgreSQL
- Visual Studio Code (recomendado)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/snacks-chicken.git
   cd snacks-chicken
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/snacks_chicken
   SESSION_SECRET=sua-chave-secreta-super-segura
   REPL_ID=seu-repl-id
   REPLIT_DOMAINS=localhost:5000
   NODE_ENV=development
   PORT=5000
   ```

4. **Configure o banco de dados**
   ```bash
   npm run db:push
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

O aplicativo estará disponível em `http://localhost:5000`

## 🔧 Visual Studio Code

### Extensões Recomendadas

O projeto inclui configurações do VSCode com extensões recomendadas:

- **Prettier** - Formatação de código
- **TypeScript** - Suporte avançado ao TypeScript  
- **Tailwind CSS IntelliSense** - Auto-complete para classes CSS
- **Auto Rename Tag** - Renomeação automática de tags HTML
- **Path Intellisense** - Auto-complete para caminhos de arquivo

### Comandos Disponíveis

Use `Ctrl+Shift+P` e digite:

- **Tasks: Run Task** → `Start Development Server`
- **Tasks: Run Task** → `Build Project` 
- **Tasks: Run Task** → `Database Push`
- **Debug: Start Debugging** → `Launch Full Stack`

## 📦 Scripts NPM

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção

# Banco de dados  
npm run db:push      # Aplica mudanças no schema
npm run db:generate  # Gera migrations
npm run db:studio    # Interface visual do banco

# Utilitários
npm start           # Inicia servidor de produção
npm run type-check  # Verificação de tipos TypeScript
```

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Inicia todos os serviços
docker-compose up -d

# Para os serviços
docker-compose down

# Rebuild da aplicação
docker-compose up --build
```

### Build de Produção

```bash
# Build da imagem
docker build -t snacks-chicken .

# Executa o container
docker run -p 5000:5000 -e DATABASE_URL="sua-url" snacks-chicken
```

## 🚀 Deploy

### GitHub Actions

O projeto inclui pipeline CI/CD automatizado:

1. **Push para branch `main`** → Deploy automático
2. **Pull Requests** → Testes automatizados
3. **Build artifacts** → Gerados automaticamente

### Plataformas Sugeridas

- **Vercel** (Frontend + API)
- **Railway** (Fullstack + PostgreSQL)  
- **Render** (Fullstack + PostgreSQL)
- **DigitalOcean App Platform**

### Variáveis de Ambiente para Produção

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=chave-super-segura-com-32-caracteres
REPL_ID=seu-repl-id-de-producao
REPLIT_DOMAINS=seudominio.com,www.seudominio.com
NODE_ENV=production
PORT=5000
```

## 📱 Como Usar

### Cliente
1. Acesse o site
2. Navegue pelo menu (Hambúrgueres/Combos)
3. Adicione itens ao carrinho
4. Clique em "Finalizar Pedido"  
5. Preencha seus dados
6. Escolha PIX para 5% de desconto
7. Escaneie o QR Code ou copie o código PIX

### Administrador
1. Acesse `/admin`
2. Faça login via Replit Auth
3. Gerencie produtos no painel
4. Visualize estatísticas em tempo real

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática  
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS
- **Shadcn/UI** - Componentes prontos
- **Wouter** - Roteamento leve
- **TanStack Query** - Gerenciamento de estado server

### Backend  
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM type-safe
- **PostgreSQL** - Banco de dados
- **Passport.js** - Autenticação
- **OpenID Connect** - Protocolo auth

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **ESBuild** - Bundler rápido

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

---

Desenvolvido com ❤️ para **Snacks Chicken** 🍗