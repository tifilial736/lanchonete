# 🛠️ Configuração para Visual Studio Code

Este guia detalha como configurar o projeto para desenvolvimento no Visual Studio Code.

## 📋 Pré-requisitos

### Obrigatório
- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **Git** - [Download](https://git-scm.com/)

### Recomendado
- **npm** (já vem com Node.js)
- **Docker Desktop** (opcional) - [Download](https://www.docker.com/products/docker-desktop/)

## 🚀 Configuração Inicial

### 1. Clone e Configure o Projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/snacks-chicken.git
cd snacks-chicken

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
```

### 2. Configure o Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Instale o PostgreSQL no seu sistema
# Windows: Use o instalador oficial
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib

# Crie o banco de dados
createdb snacks_chicken

# Configure a URL no .env.local
DATABASE_URL=postgresql://postgres:sua-senha@localhost:5432/snacks_chicken
```

#### Opção B: Docker (Mais Fácil)

```bash
# Inicie o PostgreSQL via Docker
docker run --name snacks-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=snacks_chicken \
  -p 5432:5432 \
  -d postgres:15-alpine

# Configure a URL no .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/snacks_chicken
```

### 3. Inicialize o Banco de Dados

```bash
# Aplique o schema do banco
npm run db:push

# Visualize o banco (opcional)
npm run db:studio
```

### 4. Inicie o Projeto

```bash
# Inicia o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5000`

## 🔧 Configuração do VS Code

### Extensões Automáticas

Ao abrir o projeto, o VS Code sugerirá instalar as extensões recomendadas:

- **Prettier** - Formatação automática
- **TypeScript Hero** - Melhor suporte ao TypeScript
- **Tailwind CSS IntelliSense** - Auto-complete CSS
- **Auto Rename Tag** - Renomeação automática de tags
- **Path Intellisense** - Auto-complete de caminhos

### Comandos Úteis

Use `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (macOS):

#### Tarefas (Tasks)
- `Tasks: Run Task` → `Start Development Server`
- `Tasks: Run Task` → `Build Project`
- `Tasks: Run Task` → `Database Push`
- `Tasks: Run Task` → `Database Generate`

#### Debug
- `Debug: Start Debugging` → `Launch Full Stack`
- `Debug: Start Debugging` → `Launch Server`

### Snippets de Código

O projeto inclui snippets úteis:

#### React Component
Digite `rfc` + `Tab`:
```tsx
interface ComponentNameProps {
  
}

export default function ComponentName({  }: ComponentNameProps) {
  return (
    <div data-testid="componentname-component">
      
    </div>
  );
}
```

#### API Handler
Digite `apihandler` + `Tab`:
```ts
app.get('/api/endpoint', isAuthenticated, async (req, res) => {
  try {
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

## 🗂️ Estrutura do Projeto

```
snacks-chicken/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas principais
│   │   ├── hooks/         # Hooks customizados
│   │   └── lib/           # Utilitários
├── server/                # Backend Express
│   ├── index.ts           # Servidor principal
│   ├── routes.ts          # Rotas da API
│   └── storage.ts         # Camada de dados
├── shared/                # Tipos compartilhados
│   └── schema.ts          # Schema do banco
├── .vscode/               # Configurações VS Code
└── package.json           # Dependências
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção

# Banco de Dados
npm run db:push          # Aplica mudanças no schema
npm run db:generate      # Gera arquivos de migration
npm run db:studio        # Interface visual do banco

# Utilidades
npm run type-check       # Verifica tipos TypeScript
```

## 🐛 Debug no VS Code

### Debug do Servidor

1. Vá para a aba **Run and Debug** (`Ctrl+Shift+D`)
2. Selecione **Launch Server**
3. Adicione breakpoints no código
4. Pressione `F5` para iniciar

### Debug Full Stack

1. Selecione **Launch Full Stack**
2. Isso iniciará servidor e cliente simultaneamente
3. Você pode debugar ambos os lados

### Breakpoints

- **Server**: Clique na margem esquerda dos arquivos `.ts` em `server/`
- **Client**: Use as ferramentas do navegador (`F12`)

## 🔍 Problemas Comuns

### Erro de Conexão com Banco
```bash
# Verifique se o PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Teste a conexão
psql postgresql://postgres:postgres@localhost:5432/snacks_chicken
```

### Porta em Uso
```bash
# Encontre o processo usando a porta 5000
lsof -ti:5000

# Mate o processo
kill -9 $(lsof -ti:5000)
```

### Dependências Desatualizadas
```bash
# Atualize as dependências
npm update

# Limpe o cache se necessário
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Verifique os tipos
npm run type-check

# Reinicie o servidor TypeScript no VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 🚀 Deploy

### GitHub

1. **Crie um repositório no GitHub**
2. **Configure os secrets** (Settings → Secrets and variables → Actions):
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `REPL_ID`
   - `REPLIT_DOMAINS`

3. **Push o código**:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/snacks-chicken.git
git push -u origin main
```

4. **Deploy automático** via GitHub Actions será executado automaticamente

### Plataformas Recomendadas

- **Vercel** - Ideal para apps React
- **Railway** - Excelente para fullstack
- **Render** - Boa alternativa gratuita
- **DigitalOcean** - Para projetos maiores

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal
2. Consulte a documentação das tecnologias
3. Procure por issues similares no GitHub
4. Use o VS Code integrated terminal para comandos

---

**Happy Coding!** 🎉