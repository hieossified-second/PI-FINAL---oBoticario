# 💄 Sistema de Gerenciamento de Vendas - Revendedores O Boticário

![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JSON Database](https://img.shields.io/badge/Database-JSON%20Storage-F1C40F?style=for-the-badge&logo=json&logoColor=black)

Aplicação web desenvolvida para otimizar e automatizar a rotina de revendedores independentes de O Boticário. Centraliza o controle de operações comerciais, gestão de clientes, controle de inventário em tempo real, registro de vendas e acompanhamento financeiro com armazenamento dinâmico estruturado em **arquivos JSON**.

---

## 🚀 Novidades e Arquitetura de Dados Dinâmica

Anteriormente, o sistema continha diversas informações e tabelas estáticas fixadas no HTML. Todo o repositório foi refatorado para operar de forma **100% dinâmica e reativa**:

1. **Substituição de Valores Fixos por Variáveis**:
   - **Clientes:** Tabela de clientes, busca por nome/CPF/e-mail, filtro por tipo (física/jurídica), ordenação (A-Z, Z-A), detalhes do cliente selecionado e modais para cadastro e edição.
   - **Inventário:** Contadores de estoque total, itens com estoque baixo e produtos esgotados calculados dinamicamente; listagem de produtos com badges de alerta, filtros por categoria e busca, além de cadastro e edição de produtos com seletor de cores e preços.
   - **Vendas:** Integração total entre catálogo de produtos, clientes cadastrados e estoque. O revendedor seleciona clientes e produtos reais, o carrinho valida a quantidade disponível no estoque, calcula subtotais e valor total, e ao finalizar a venda:
     - Cria o registro no histórico de vendas.
     - Abate automaticamente as quantidades vendidas do estoque.
     - Registra uma receita correspondente no módulo financeiro.
   - **Financeiro:** Cálculo dinâmico de faturamento, despesas totais e lucro líquido; gráfico de faturamento diário gerado dinamicamente com base nas movimentações reais; distribuição percentual de despesas por categoria e cadastro de novas receitas/despesas.
   - **Home / Dashboard:** Painel com totais em tempo real de clientes, vendas acumuladas, faturamento e produtos em estoque, além de exibir as últimas vendas registradas.

2. **Banco de Dados Estruturado em Arquivos JSON**:
   - Coleções JSON padronizadas localizadas em `public/data/` e tipadas no Angular:
     - `usuarios.json`: Dados cadastrais de usuários, administradores e revendedores.
     - `clientes.json`: Clientes cadastrados, documentos, contatos e histórico.
     - `produtos.json`: Produtos, categorias, estoque atual, estoque mínimo e preços.
     - `vendas.json`: Histórico de pedidos finalizados e itens.
     - `financeiro.json`: Transações de receitas e despesas.
   - **Serviço de Banco de Dados (`DatabaseService`)**:
     - Gerencia operações de CRUD (Create, Read, Update, Delete) para todas as entidades.
     - Persistência automática em `localStorage` para manter alterações entre sessões do navegador.
     - Suporte a **Exportação (`.json`)** de todo o banco de dados para download e **Importação (`.json`)** de arquivos para restauração ou migração de dados.
     - Botão de restauração para os dados originais padrão de fábrica.

3. **Gerenciador de Usuários Integrado**:
   - Acessível através do cabeçalho de qualquer página clicando no avatar do usuário ativo (`Olá, [Nome] ⚙️`).
   - Permite consultar, cadastrar novos usuários, alterar dados (nome, e-mail, cargo, telefone, avatar, status) e alternar facilmente o usuário da sessão.

---

## 📁 Estrutura do Projeto

```text
📦 Projeto_oBoticario
 ┣ 📂 public
 ┃ ┣ 📂 data                    # Arquivos JSON estruturados (banco de dados)
 ┃ ┃ ┣ 📜 usuarios.json
 ┃ ┃ ┣ 📜 clientes.json
 ┃ ┃ ┣ 📜 produtos.json
 ┃ ┃ ┣ 📜 vendas.json
 ┃ ┃ ┗ 📜 financeiro.json
 ┃ ┣ 📜 favicon.ico
 ┃ ┗ 📜 O-Boticário.ico
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┃ ┣ 📂 menu                # Menu lateral com navegação RouterLink SPA
 ┃ ┃ ┃ ┗ 📂 usuario-modal       # Modal de Gestão de Usuários e Backup JSON
 ┃ ┃ ┣ 📂 data                  # Dados padrão e sementes iniciais tipadas
 ┃ ┃ ┣ 📂 models                # Interfaces TypeScript de Usuário, Cliente, Produto, Venda e Financeiro
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┃ ┣ 📂 clientes            # Gestão e CRUD de clientes
 ┃ ┃ ┃ ┣ 📂 financeiro          # Gestão de fluxo de caixa, gráficos e despesas
 ┃ ┃ ┃ ┣ 📂 home                # Dashboard geral e resumos em tempo real
 ┃ ┃ ┃ ┣ 📂 inventario          # Controle de estoque e catálogo de produtos
 ┃ ┃ ┃ ┗ 📂 vendas              # Ponto de venda, carrinho e registro integrado
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┃ ┗ 📜 database.service.ts # Engine do Banco de Dados JSON reativo
 ┃ ┃ ┣ 📜 app.component.ts
 ┃ ┃ ┣ 📜 app.config.ts
 ┃ ┃ ┗ 📜 app.routes.ts
 ┃ ┣ 📜 index.html
 ┃ ┣ 📜 main.ts
 ┃ ┗ 📜 styles.css
 ┣ 📜 angular.json
 ┣ 📜 docker-compose.yml
 ┣ 📜 Dockerfile
 ┣ 📜 package.json
 ┗ 📜 README.md
```

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou pnpm

### Passos de Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm start
   # ou: npx ng serve
   ```
   Acesse a aplicação no navegador em `http://localhost:4200`.

3. **Compilar para produção:**
   ```bash
   npm run build
   ```
   Os arquivos compilados serão gerados no diretório `dist/app/browser/`.

4. **Executar via Docker (opcional):**
   ```bash
   docker compose up --build
   ```
