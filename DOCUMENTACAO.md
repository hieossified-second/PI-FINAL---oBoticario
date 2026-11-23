# 💄 Manual e Guia Completo do Projeto - O Boticário

Bem-vindo(a) à documentação oficial do **Sistema de Gerenciamento de Vendas e Estoque para Revendedores O Boticário**. Este guia foi planejado para ser claro, didático e prático, permitindo que qualquer desenvolvedor — mesmo quem estiver abrindo o projeto pela primeira vez — consiga navegar, entender o fluxo de dados, realizar modificações com segurança e expandir as funcionalidades da aplicação.

---

## 📑 Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Estrutura Completa de Pastas e Arquivos](#2-estrutura-completa-de-pastas-e-arquivos)
3. [Localização de Componentes, Estilos e Recursos](#3-localização-de-componentes-estilos-e-recursos)
4. [Fluxo de Funcionamento e Arquitetura Reativa](#4-fluxo-de-funcionamento-e-arquitetura-reativa)
5. [Banco de Dados JSON e Persistência](#5-banco-de-dados-json-e-persistência)
   - 5.1 [Estrutura dos Arquivos JSON](#51-estrutura-dos-arquivos-json)
   - 5.2 [Como Consultar, Inserir, Atualizar e Excluir](#52-como-consultar-inserir-atualizar-e-excluir)
   - 5.3 [Backup, Exportação e Importação](#53-backup-exportação-e-importação)
6. [Guia Prático de Alterações (Passo a Passo)](#6-guia-prático-de-alterações-passo-a-passo)
   - 6.1 [Como alterar textos e títulos](#61-como-alterar-textos-e-títulos)
   - 6.2 [Como alterar cores e estilos visuais](#62-como-alterar-cores-e-estilos-visuais)
   - 6.3 [Como adicionar ou modificar campos em formulários](#63-como-adicionar-ou-modificar-campos-em-formulários)
7. [Dependências e Relações entre Arquivos](#7-dependências-e-relações-entre-arquivos)
8. [Comandos de Instalação, Execução, Testes e Build](#8-comandos-de-instalação-execução-testes-e-build)
9. [Guia de Manutenção e Expansão (Como Criar Novas Telas)](#9-guia-de-manutenção-e-expansão-como-criar-novas-telas)
10. [Cuidados Importantes e Arquivos Sensíveis](#10-cuidados-importantes-e-arquivos-sensíveis)

---

## 1. Visão Geral do Projeto

O sistema é uma aplicação web **Single Page Application (SPA)** construída com **Angular 19** e **TypeScript**. Ela centraliza as principais necessidades do revendedor:
- **Painel Geral (Home):** Indicadores consolidados de vendas, estoque, faturamento e resumo financeiro.
- **Gestão de Clientes:** Cadastro, consulta, edição, exclusão e detalhamento de pessoas físicas e jurídicas.
- **Inventário de Produtos:** Controle de catálogo, quantidade em estoque, valores, alertas de estoque baixo e esgotado.
- **Ponto de Vendas:** Seleção de clientes e produtos, controle de carrinho dinâmico com limite por estoque, finalização de pedido com abate automático de estoque e criação de receita financeira.
- **Financeiro:** Gestão de receitas e despesas, cálculo de lucro líquido, gráfico de faturamento dos últimos 7 dias e distribuição de custos por categoria.
- **Gerenciador de Usuários e Banco JSON:** Modal para alternar sessão de usuário, cadastrar novos operadores e exportar/importar cópias do banco de dados em formato `.json`.

---

## 2. Estrutura Completa de Pastas e Arquivos

Abaixo está o mapa detalhado de todo o projeto com a finalidade de cada diretório e arquivo:

```text
Projeto_oBoticario/
├── .editorconfig                     # Configurações de formatação de código (espaçamento, quebra de linha)
├── .gitignore                        # Arquivos e pastas ignorados pelo controle de versão do Git
├── .vscode/                          # Configurações de tarefas e depuração do VS Code
│   ├── extensions.json               # Extensões recomendadas (Angular Language Service)
│   ├── launch.json                   # Configurações de depuração no navegador
│   └── tasks.json                    # Tarefas de compilação automáticas
├── angular.json                      # Configuração global do Angular CLI (build, assets, orçamentos de bundle)
├── docker-compose.yml                # Orquestração do contêiner Docker para executar o frontend
├── Dockerfile                        # Instruções multi-stage de build (Node) e servidor web (Nginx)
├── nginx.conf                        # Configuração do Nginx para servir a SPA em produção
├── package.json                      # Dependências do projeto (npm) e scripts de execução
├── package-lock.json                 # Versões exatas e árvore de resolução de dependências
├── tsconfig.json                     # Configuração base do TypeScript
├── tsconfig.app.json                 # Configurações de compilação da aplicação Angular
├── tsconfig.spec.json                # Configurações de compilação dos testes unitários
├── README.md                         # Apresentação do repositório
├── DOCUMENTACAO.md                   # Este manual completo de desenvolvimento
├── public/                           # Arquivos estáticos servidos diretamente na raiz
│   ├── favicon.ico                   # Ícone padrão de navegador
│   ├── O-Boticário.ico               # Ícone oficial da marca O Boticário
│   └── data/                         # Arquivos JSON que estruturam o banco de dados
│       ├── usuarios.json             # Dados dos usuários do sistema
│       ├── clientes.json             # Catálogo de clientes cadastrados
│       ├── produtos.json             # Catálogo de produtos e estoques
│       ├── vendas.json               # Histórico das vendas finalizadas
│       └── financeiro.json           # Movimentações financeiras (receitas e despesas)
└── src/                              # Código-fonte principal da aplicação
    ├── index.html                    # Página HTML única de entrada do SPA
    ├── main.ts                       # Ponto de inicialização do Angular (bootstrap)
    ├── styles.css                    # Folha de estilos global da aplicação
    └── app/                          # Código modular da aplicação
        ├── app.component.html        # Template raiz contendo o <router-outlet>
        ├── app.component.ts          # Componente raiz da aplicação
        ├── app.component.css         # Estilo do componente raiz
        ├── app.component.spec.ts     # Teste unitário do componente raiz
        ├── app.config.ts             # Provedores de configuração global (rotas, detecção de mudanças)
        ├── app.routes.ts             # Definição de rotas URL do projeto
        ├── components/               # Componentes reutilizáveis
        │   ├── menu/                 # Menu lateral de navegação
        │   │   ├── menu.component.html
        │   │   ├── menu.component.ts
        │   │   ├── menu.component.css
        │   │   └── menu.component.spec.ts
        │   └── usuario-modal/        # Modal para gerenciar usuários e banco JSON
        │       ├── usuario-modal.component.html
        │       ├── usuario-modal.component.ts
        │       └── usuario-modal.component.css
        ├── data/                     # Dados iniciais padronizados
        │   └── default-data.ts       # Sementes padrão (seeds) tipadas para inicialização segura
        ├── models/                   # Interfaces TypeScript (definição dos dados)
        │   ├── usuario.model.ts      # Modelo de dados de Usuário
        │   ├── cliente.model.ts      # Modelo de dados de Cliente
        │   ├── produto.model.ts      # Modelo de dados de Produto
        │   ├── venda.model.ts        # Modelo de dados de Venda e Itens de Carrinho
        │   └── financeiro.model.ts   # Modelo de dados de Transações Financeiras
        ├── pages/                    # Páginas principais (rotas)
        │   ├── home/                 # Tela inicial (Dashboard com resumos e métricas)
        │   ├── clientes/             # Tela de gerenciamento e detalhes de clientes
        │   ├── inventario/           # Tela de estoque e catálogo de produtos
        │   ├── vendas/               # Ponto de venda com carrinho e finalização
        │   └── financeiro/           # Controle de receitas, despesas e gráficos
        └── services/                 # Serviços de lógica e acesso a dados
            ├── database.service.ts   # Engine do Banco de Dados JSON reativo
            └── database.service.spec.ts # Testes automatizados do banco de dados
```

---

## 3. Localização de Componentes, Estilos e Recursos

| O que você quer localizar? | Onde está localizado? |
| :--- | :--- |
| **Rotas e URLs da aplicação** | `src/app/app.routes.ts` |
| **Serviço Central de Dados (CRUD e JSON)** | `src/app/services/database.service.ts` |
| **Modelos de dados (Interfaces)** | `src/app/models/*.model.ts` |
| **Sementes e dados iniciais de fábrica** | `src/app/data/default-data.ts` e `public/data/*.json` |
| **Menu lateral de navegação** | `src/app/components/menu/` |
| **Modal de Usuários e Backup do Banco** | `src/app/components/usuario-modal/` |
| **Página: Dashboard (Home)** | `src/app/pages/home/` |
| **Página: Clientes** | `src/app/pages/clientes/` |
| **Página: Inventário / Estoque** | `src/app/pages/inventario/` |
| **Página: Vendas e Carrinho** | `src/app/pages/vendas/` |
| **Página: Financeiro e Gráficos** | `src/app/pages/financeiro/` |
| **Ícones estáticos (favicon, logo)** | `public/` |
| **Estilos Globais** | `src/styles.css` |
| **Estilos Específicos de cada Tela** | Na pasta da própria tela: `[nome].component.css` |

---

## 4. Fluxo de Funcionamento e Arquitetura Reativa

O projeto adota uma arquitetura limpa e orientada a eventos reativos usando RxJS:

```
[ Arquivos JSON / localStorage ]
               │
               ▼
     [ DatabaseService ] (RxJS BehaviorSubjects)
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼
 [ Home ] [ Clientes ] [ Inventário ] [ Vendas ] [ Financeiro ]
```

### Como os dados fluem:
1. **Carregamento Inicial:** Ao abrir o sistema, o `DatabaseService` tenta ler os dados salvos em `localStorage` sob a chave `boticario_db_v1`. Se não houver dados gravados, ele carrega automaticamente os dados de semente definidos em `default-data.ts`.
2. **Distribuição em Tempo Real:** O `DatabaseService` possui `BehaviorSubject` para cada entidade (`usuarios$`, `usuarioAtual$`, `clientes$`, `produtos$`, `vendas$`, `financeiro$`).
3. **Inscrição dos Componentes:** Cada página se inscreve nos dados que precisa através do método `ngOnInit()`. Quando um dado é alterado em qualquer ponto da aplicação, todas as telas inscritas recebem os novos valores imediatamente.
4. **Exemplo de Integração Total (Finalizar uma Venda):**
   - O usuário seleciona o cliente e os produtos na tela de **Vendas**.
   - O carrinho valida a quantidade contra o estoque do produto.
   - Ao clicar em "Finalizar venda", a função `createVenda()` do `DatabaseService` é executada.
   - Automaticamente:
     1. Cria o registro da nova venda no histórico.
     2. Abate as quantidades vendidas no estoque de cada produto em **Inventário**.
     3. Cria uma movimentação financeira do tipo "Receita" em **Financeiro**.
     4. Atualiza os totais de faturamento e vendas na **Home**.
     5. Persiste o novo estado em JSON no `localStorage`.

---

## 5. Banco de Dados JSON e Persistência

### 5.1 Estrutura dos Arquivos JSON

Os arquivos de dados residem na pasta `public/data/` e são estruturados como tabelas relacionais em formato JSON:

#### `usuarios.json` (Exemplo)
```json
[
  {
    "id": "usr-1",
    "nome": "Administrador",
    "email": "admin@boticario.com.br",
    "cargo": "Gerente Geral",
    "avatar": "A",
    "telefone": "(11) 98765-4321",
    "status": "Ativo",
    "dataCriacao": "2024-01-10"
  }
]
```

#### `produtos.json` (Exemplo)
```json
[
  {
    "id": "prod-1",
    "nome": "Floratta Des. Colônia",
    "categoria": "Perfumaria",
    "estoque": 35,
    "estoqueMinimo": 10,
    "valor": 189.90,
    "cor": "#E9A9A5"
  }
]
```

### 5.2 Como Consultar, Inserir, Atualizar e Excluir

Toda operação de dados deve ser realizada injetando o serviço `DatabaseService`:

```typescript
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Cliente } from '../../models/cliente.model';

@Component({ ... })
export class ExemploComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private db: DatabaseService) {}

  ngOnInit(): void {
    // 1. Consultar (tempo real)
    this.db.clientes$.subscribe(dados => {
      this.clientes = dados;
    });
  }

  // 2. Inserir
  adicionarNovo(): void {
    this.db.createCliente({
      nome: 'Carla Dias',
      cpf: '123.456.789-99',
      telefone: '(11) 98888-0000',
      email: 'carla@email.com',
      tipo: 'Pessoa física',
      dataCadastro: '2026-11-22'
    });
  }

  // 3. Atualizar
  atualizar(id: string): void {
    this.db.updateCliente(id, {
      telefone: '(11) 97777-1111'
    });
  }

  // 4. Excluir
  excluir(id: string): void {
    this.db.deleteCliente(id);
  }
}
```

### 5.3 Backup, Exportação e Importação

- **Exportar:** Clicando em `Olá, [Nome] ⚙️` no cabeçalho e acessando a aba **Banco de Dados JSON**, o usuário pode clicar em **Exportar Banco (.json)** para baixar o arquivo completo com todas as tabelas.
- **Importar:** Na mesma tela, clicando em **Carregar Arquivo JSON**, é possível restaurar dados salvos em outro navegador ou computador.
- **Restaurar Padrão:** O botão vermelho **Restaurar Dados Iniciais** limpa modificações e recarrega as sementes de fábrica.

---

## 6. Guia Prático de Alterações (Passo a Passo)

### 6.1 Como alterar textos e títulos

#### Exemplo: Mudar o título principal da página de Clientes
1. Abra o arquivo: `src/app/pages/clientes/clientes.component.html`.
2. Localize a seção `<section class="cabecalho">`:
   ```html
   <div>
       <h1>Clientes</h1>
       <p>Gerencie o cadastro dinâmico e consulte os clientes da sua loja.</p>
   </div>
   ```
3. Modifique o texto desejado e salve o arquivo.

---

### 6.2 Como alterar cores e estilos visuais

O projeto utiliza a identidade visual clássica de O Boticário:
- **Verde Escuro Principal:** `#0F3B2E` ou `#0D3B2F`
- **Verde Médio / Ação:** `#1F5C46` ou `#2B6B53`
- **Fundo Claro (Off-white/Creme):** `#F8F6F1`
- **Bordas Neutras:** `#E7E3DA`

#### Exemplo: Alterar a cor do menu lateral
1. Abra o arquivo: `src/app/components/menu/menu.component.css`.
2. Localize a classe `.menu`:
   ```css
   .menu {
       width: 235px;
       background-color: #0d3b2f; /* <-- Altere esta cor aqui */
       color: white;
   }
   ```

---

### 6.3 Como adicionar ou modificar campos em formulários

#### Exemplo: Adicionar um campo "Observações" no cadastro de clientes
1. **Passo 1: Atualizar o Modelo de Dados:**
   - Abra: `src/app/models/cliente.model.ts`.
   - Adicione o campo opcional `observacoes?: string;`:
     ```typescript
     export interface Cliente {
       id: string;
       nome: string;
       cpf: string;
       telefone: string;
       email: string;
       tipo: 'Pessoa física' | 'Pessoa jurídica';
       dataCadastro: string;
       observacoes?: string; // Novo campo
     }
     ```
2. **Passo 2: Atualizar a Lógica do Componente:**
   - Abra: `src/app/pages/clientes/clientes.component.ts`.
   - No objeto `clienteForm`, inclua o campo `observacoes: ''`.
   - Nos métodos `abrirModalNovo` e `abrirModalEditar`, repasse o valor de `observacoes`.
3. **Passo 3: Atualizar o Template HTML:**
   - Abra: `src/app/pages/clientes/clientes.component.html`.
   - Dentro da tag `<form (ngSubmit)="salvarCliente()">`, insira o novo campo:
     ```html
     <div class="campo-grupo">
         <label>Observações</label>
         <input type="text" [(ngModel)]="clienteForm.observacoes" name="observacoes" placeholder="Ex: Prefere atendimento via WhatsApp">
     </div>
     ```

---

## 7. Dependências e Relações entre Arquivos

Para manter o projeto íntegro, tenha em mente as seguintes relações de dependência:

1. **`DatabaseService` (`src/app/services/database.service.ts`):**
   - **Quem depende dele:** Praticamente todas as páginas (`Home`, `Clientes`, `Inventario`, `Vendas`, `Financeiro`, `UsuarioModal`).
   - **Regra:** Não altere as assinaturas de métodos existentes (`getClientes()`, `getProdutos()`, `createVenda()`, etc.) sem atualizar os componentes que os invocam.
2. **Modelos (`src/app/models/*.ts`):**
   - **Quem depende deles:** `DatabaseService` e todas as páginas.
   - **Regra:** Ao adicionar campos obrigatórios em um modelo, forneça valores padrão em `default-data.ts`.
3. **Menu (`src/app/components/menu/`):**
   - É um componente independente. Qualquer alteração visual em `menu.component.css` não quebra a lógica de dados.
4. **Rotas (`src/app/app.routes.ts`):**
   - Conecta caminhos de URL (`/clientes`, `/vendas`) com as classes componentes.

---

## 8. Comandos de Instalação, Execução, Testes e Build

Execute os comandos a partir da raiz do projeto (`c:\Users\daang\OneDrive\Desktop\WEB\Projeto_oBoticario`):

### 1. Instalar as dependências do projeto
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm start
# ou: npx ng serve
```
O terminal informará a URL local. Abra seu navegador em:
👉 **`http://localhost:4200`**

### 3. Executar os testes automatizados
```bash
npm test
```

### 4. Gerar a versão de produção (Build)
```bash
npm run build
```
Os arquivos otimizados e prontos para hospedagem serão gerados na pasta:
📂 **`dist/app/browser/`**

### 5. Executar via Docker (Opcional)
```bash
docker compose up --build
```
Acesse a aplicação através da porta `4200`: `http://localhost:4200`.

---

## 9. Guia de Manutenção e Expansão (Como Criar Novas Telas)

Para adicionar uma nova funcionalidade (por exemplo, uma tela de **Fornecedores**):

### Passo 1: Criar o Modelo de Dados
Crie `src/app/models/fornecedor.model.ts`:
```typescript
export interface Fornecedor {
  id: string;
  razaoSocial: string;
  cnpj: string;
  contato: string;
}
```

### Passo 2: Adicionar Métodos no `DatabaseService`
Abra `src/app/services/database.service.ts`:
1. Crie o Subject: `private fornecedoresSubject = new BehaviorSubject<Fornecedor[]>([]);`
2. Crie o Observable: `public fornecedores$ = this.fornecedoresSubject.asObservable();`
3. Crie os métodos: `getFornecedores()`, `createFornecedor()`, etc.

### Passo 3: Criar a Página (Componente)
Crie a pasta `src/app/pages/fornecedores/` com os arquivos:
- `fornecedores.component.ts`
- `fornecedores.component.html`
- `fornecedores.component.css`

Exemplo do `fornecedores.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.css'
})
export class FornecedoresComponent implements OnInit {
  constructor(public db: DatabaseService) {}
  ngOnInit(): void {}
}
```

### Passo 4: Registrar a Nova Rota
Abra `src/app/app.routes.ts` e insira a nova rota:
```typescript
import { FornecedoresComponent } from './pages/fornecedores/fornecedores.component';

export const routes: Routes = [
    // ...
    { path: "fornecedores", component: FornecedoresComponent },
    { path: "**", redirectTo: "" }
];
```

### Passo 5: Adicionar o Link no Menu Lateral
Abra `src/app/components/menu/menu.component.html`:
```html
<nav>
    <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{exact: true}">Home</a>
    <a routerLink="/clientes" routerLinkActive="ativo">Clientes</a>
    <a routerLink="/fornecedores" routerLinkActive="ativo">Fornecedores</a> <!-- Novo link -->
    <a routerLink="/vendas" routerLinkActive="ativo">Vendas</a>
    <a routerLink="/financeiro" routerLinkActive="ativo">Financeiro</a>
    <a routerLink="/inventario" routerLinkActive="ativo">Inventário</a>
</nav>
```

---

## 10. Cuidados Importantes e Arquivos Sensíveis

- ⚠️ **`angular.json`:** Controla onde os arquivos compilados são gerados (`outputPath`), limites de tamanho de folha de estilos (`budgets`) e pastas de assets. Não altere sem necessidade técnica comprovada.
- ⚠️ **`package.json`:** Contém as versões de bibliotecas Angular 19 e TypeScript 5.7. Evite atualizar pacotes individuais com comandos `--force` para não gerar incompatibilidades com os compiladores do Angular.
- ⚠️ **`src/app/services/database.service.ts`:** É o coração de dados do sistema. Certifique-se de que qualquer nova função que salve dados invoque `this.salvarEstado()` para persistir as alterações no `localStorage`.
- ⚠️ **Tags `<script>` dentro de Templates Angular:** Nunca insira scripts JS puros dentro de arquivos `.html` de componentes Angular. Toda a lógica de clique, formulários e eventos deve residir nas funções dos arquivos `.ts` correspondentes.
- ⚠️ **Limpeza de Cache do Navegador:** Caso você faça alterações manuais diretas nos arquivos `.json` de `public/data/` e não as veja refletidas na tela, lembre-se de que o navegador prioriza os dados persistidos no `localStorage`. Para forçar a recarga dos dados padrão, basta clicar no cabeçalho em `Olá, [Nome] ⚙️` -> aba **Banco de Dados JSON** -> **Restaurar Dados Iniciais**.

---

*Manual elaborado para garantir facilidade de manutenção, estabilidade e rápida evolução do projeto O Boticário.*
