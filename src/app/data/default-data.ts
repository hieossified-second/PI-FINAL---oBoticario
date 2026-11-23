import { Usuario } from '../models/usuario.model';
import { Cliente } from '../models/cliente.model';
import { Produto } from '../models/produto.model';
import { Venda } from '../models/venda.model';
import { TransacaoFinanceira } from '../models/financeiro.model';

export const DEFAULT_USUARIOS: Usuario[] = [
  {
    id: 'usr-1',
    nome: 'Administrador',
    email: 'admin@boticario.com.br',
    cargo: 'Gerente Geral',
    avatar: 'A',
    telefone: '(11) 98765-4321',
    status: 'Ativo',
    dataCriacao: '2024-01-10',
    nomeLoja: 'oBOTICÁRIO',
    fraseBanner: 'O Boticário é beleza que transforma',
    subtituloBanner: 'Mais do que produtos, entregamos autocuidado, autoestima e bem-estar.',
    metaVendas: 50,
    metaFaturamento: 15000,
    percentualCrescimentoVendas: 8,
    percentualCrescimentoFaturamento: 15,
    percentualCrescimentoTicket: 6,
    percentualCrescimentoReceita: 15,
    percentualCrescimentoDespesas: 8,
    percentualCrescimentoLucro: 18
  },
  {
    id: 'usr-2',
    nome: 'Camila Boticário',
    email: 'camila.revendedora@boticario.com.br',
    cargo: 'Revendedora Diamante',
    avatar: 'C',
    telefone: '(11) 99123-4567',
    status: 'Ativo',
    dataCriacao: '2024-02-15',
    nomeLoja: 'Espaço Camila Boticário',
    fraseBanner: 'Viva a beleza de se cuidar todos os dias',
    subtituloBanner: 'Fragrâncias marcantes e cosméticos exclusivos para você.',
    metaVendas: 80,
    metaFaturamento: 25000,
    percentualCrescimentoVendas: 12,
    percentualCrescimentoFaturamento: 20,
    percentualCrescimentoTicket: 8,
    percentualCrescimentoReceita: 20,
    percentualCrescimentoDespesas: 5,
    percentualCrescimentoLucro: 25
  },
  {
    id: 'usr-3',
    nome: 'Rodrigo Silva',
    email: 'rodrigo.consultor@boticario.com.br',
    cargo: 'Consultor de Vendas',
    avatar: 'R',
    telefone: '(11) 97654-3210',
    status: 'Ativo',
    dataCriacao: '2024-04-01',
    nomeLoja: 'Rodrigo Cosméticos',
    fraseBanner: 'Consultoria e produtos sob medida',
    subtituloBanner: 'Atendimento personalizado e pronta entrega em sua região.',
    metaVendas: 40,
    metaFaturamento: 12000,
    percentualCrescimentoVendas: 6,
    percentualCrescimentoFaturamento: 10,
    percentualCrescimentoTicket: 4,
    percentualCrescimentoReceita: 10,
    percentualCrescimentoDespesas: 7,
    percentualCrescimentoLucro: 14
  }
];

export const DEFAULT_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    nome: 'Mariana Silva',
    cpf: '123.456.789-01',
    telefone: '(11) 98765-4321',
    email: 'mariana.silva@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-10-16'
  },
  {
    id: 'cli-2',
    nome: 'João Santos',
    cpf: '987.654.321-00',
    telefone: '(11) 91234-5678',
    email: 'joao.santos@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-09-12'
  },
  {
    id: 'cli-3',
    nome: 'Ana Costa',
    cpf: '456.123.789-00',
    telefone: '(11) 99876-5432',
    email: 'ana.costa@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-08-05'
  },
  {
    id: 'cli-4',
    nome: 'Lucas Oliveira',
    cpf: '321.654.987-00',
    telefone: '(11) 93456-7890',
    email: 'lucas.oliveira@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-07-21'
  },
  {
    id: 'cli-5',
    nome: 'Fernanda Lima',
    cpf: '789.456.123-00',
    telefone: '(11) 97654-3210',
    email: 'fernanda.lima@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-06-18'
  },
  {
    id: 'cli-6',
    nome: 'Carlos Almeida',
    cpf: '654.987.321-00',
    telefone: '(11) 95543-2109',
    email: 'carlos.almeida@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-05-30'
  },
  {
    id: 'cli-7',
    nome: 'Beatriz Souza',
    cpf: '258.741.963-00',
    telefone: '(11) 98231-5467',
    email: 'contato@souzacosmeticos.com.br',
    tipo: 'Pessoa jurídica',
    dataCadastro: '2024-04-14'
  },
  {
    id: 'cli-8',
    nome: 'Rafael Pereira',
    cpf: '963.852.741-00',
    telefone: '(11) 97021-3345',
    email: 'rafael.pereira@email.com',
    tipo: 'Pessoa física',
    dataCadastro: '2024-03-22'
  }
];

export const DEFAULT_PRODUTOS: Produto[] = [
  {
    id: 'prod-1',
    nome: 'Floratta Des. Colônia',
    categoria: 'Perfumaria',
    estoque: 35,
    estoqueMinimo: 10,
    valor: 189.90,
    cor: '#E9A9A5'
  },
  {
    id: 'prod-2',
    nome: 'Malbec Des. Colônia',
    categoria: 'Perfumaria',
    estoque: 28,
    estoqueMinimo: 10,
    valor: 159.90,
    cor: '#1A1A1A'
  },
  {
    id: 'prod-3',
    nome: 'Nativa SPA Ameixa',
    categoria: 'Cuidados Pessoais',
    estoque: 12,
    estoqueMinimo: 15,
    valor: 129.90,
    cor: '#8E2F3E'
  },
  {
    id: 'prod-4',
    nome: 'Kit Presente Cuide-se Bem',
    categoria: 'Kits',
    estoque: 18,
    estoqueMinimo: 8,
    valor: 99.90,
    cor: '#F0B5B0'
  },
  {
    id: 'prod-5',
    nome: 'Egeo Dolce',
    categoria: 'Perfumaria',
    estoque: 22,
    estoqueMinimo: 10,
    valor: 139.90,
    cor: '#D9344A'
  },
  {
    id: 'prod-6',
    nome: 'Shampoo Nativa SPA',
    categoria: 'Cabelos',
    estoque: 40,
    estoqueMinimo: 12,
    valor: 69.90,
    cor: '#242424'
  },
  {
    id: 'prod-7',
    nome: 'Hidratante Corporal Cuide-se Bem',
    categoria: 'Cuidados Pessoais',
    estoque: 5,
    estoqueMinimo: 10,
    valor: 59.90,
    cor: '#558B2F'
  },
  {
    id: 'prod-8',
    nome: 'Batom Make B. Velvet',
    categoria: 'Maquiagem',
    estoque: 0,
    estoqueMinimo: 5,
    valor: 49.90,
    cor: '#C2185B'
  }
];

export const DEFAULT_VENDAS: Venda[] = [
  {
    id: 'ven-1',
    clienteId: 'cli-1',
    clienteNome: 'Mariana Silva',
    data: '16/10/2024',
    itens: [
      {
        produtoId: 'prod-1',
        nome: 'Floratta Des. Colônia',
        preco: 189.90,
        quantidade: 1,
        subtotal: 189.90
      }
    ],
    descricaoProdutos: 'Floratta + Hidratante',
    valorTotal: 189.90,
    status: 'Concluída'
  },
  {
    id: 'ven-2',
    clienteId: 'cli-2',
    clienteNome: 'João Santos',
    data: '15/10/2024',
    itens: [
      {
        produtoId: 'prod-2',
        nome: 'Malbec Des. Colônia',
        preco: 159.90,
        quantidade: 1,
        subtotal: 159.90
      }
    ],
    descricaoProdutos: 'Malbec',
    valorTotal: 159.90,
    status: 'Concluída'
  },
  {
    id: 'ven-3',
    clienteId: 'cli-3',
    clienteNome: 'Ana Costa',
    data: '15/10/2024',
    itens: [
      {
        produtoId: 'prod-3',
        nome: 'Nativa SPA Ameixa',
        preco: 129.90,
        quantidade: 1,
        subtotal: 129.90
      }
    ],
    descricaoProdutos: 'Nativa SPA Ameixa',
    valorTotal: 129.90,
    status: 'Concluída'
  },
  {
    id: 'ven-4',
    clienteId: 'cli-4',
    clienteNome: 'Lucas Oliveira',
    data: '14/10/2024',
    itens: [
      {
        produtoId: 'prod-4',
        nome: 'Kit Presente Cuide-se Bem',
        preco: 99.90,
        quantidade: 1,
        subtotal: 99.90
      }
    ],
    descricaoProdutos: 'Kit Presente Cuide-se Bem',
    valorTotal: 99.90,
    status: 'Concluída'
  },
  {
    id: 'ven-5',
    clienteId: 'cli-5',
    clienteNome: 'Fernanda Lima',
    data: '14/10/2024',
    itens: [
      {
        produtoId: 'prod-5',
        nome: 'Egeo Dolce',
        preco: 139.90,
        quantidade: 1,
        subtotal: 139.90
      }
    ],
    descricaoProdutos: 'Egeo Dolce',
    valorTotal: 139.90,
    status: 'Concluída'
  }
];

export const DEFAULT_FINANCEIRO: TransacaoFinanceira[] = [
  {
    id: 'mov-1',
    data: '16/10/2024',
    descricao: 'Venda de produtos',
    categoria: 'Vendas',
    valor: 249.80,
    tipo: 'Receita'
  },
  {
    id: 'mov-2',
    data: '15/10/2024',
    descricao: 'Compra de produtos',
    categoria: 'Fornecedores',
    valor: 1250.00,
    tipo: 'Despesa'
  },
  {
    id: 'mov-3',
    data: '14/10/2024',
    descricao: 'Energia elétrica',
    categoria: 'Contas fixas',
    valor: 320.00,
    tipo: 'Despesa'
  },
  {
    id: 'mov-4',
    data: '13/10/2024',
    descricao: 'Venda de produtos',
    categoria: 'Vendas',
    valor: 189.90,
    tipo: 'Receita'
  },
  {
    id: 'mov-5',
    data: '12/10/2024',
    descricao: 'Marketing Digital',
    categoria: 'Marketing',
    valor: 150.00,
    tipo: 'Despesa'
  },
  {
    id: 'mov-6',
    data: '11/10/2024',
    descricao: 'Venda de kits',
    categoria: 'Vendas',
    valor: 399.60,
    tipo: 'Receita'
  },
  {
    id: 'mov-7',
    data: '10/10/2024',
    descricao: 'Salários de equipe',
    categoria: 'Salários',
    valor: 1200.00,
    tipo: 'Despesa'
  }
];
