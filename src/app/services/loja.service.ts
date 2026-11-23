import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProdutoLoja {
  id: number;
  nome: string;
  subtitulo: string;
  categoria: string;
  preco: number;
  precoAntigo?: number;
  desconto?: string;
  avaliacao: string;
  totalAvaliacoes: number;
  selo?: string;
  descricao?: string;
}

export interface ItemCarrinho {
  produto: ProdutoLoja;
  quantidade: number;
}

export interface Pedido {
  numero: string;
  data: string;
  status: 'Em andamento' | 'Entregue' | 'Cancelado';
  previsao: string;
  etapaAtual: number;
  itens: { nome: string; quantidade: number }[];
  total: number;
}

export interface Clientela {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  pedidosFeitos: number;
}

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private readonly STORAGE_CARRINHO = 'boticario_loja_carrinho';
  private readonly STORAGE_PEDIDOS = 'boticario_loja_pedidos';
  private readonly STORAGE_CLIENTELAS = 'boticario_loja_clientelas';

  readonly catalogo: ProdutoLoja[] = [
    {
      id: 1,
      nome: 'Floratta Cerejeira em Flor',
      subtitulo: 'Desodorante Colônia, 75 ml',
      categoria: 'Perfume',
      preco: 129.90,
      precoAntigo: 169.90,
      desconto: '23% OFF',
      avaliacao: '★★★★★',
      totalAvaliacoes: 1243,
      selo: 'Mais vendido',
      descricao: 'Uma fragrância floral e envolvente, que combina a delicadeza da cerejeira com a feminilidade única de Floratta.'
    },
    {
      id: 2,
      nome: 'Malbec Club',
      subtitulo: 'Desodorante Colônia, 100 ml',
      categoria: 'Perfume',
      preco: 159.90,
      avaliacao: '★★★★☆',
      totalAvaliacoes: 856
    },
    {
      id: 3,
      nome: 'Nativa SPA Ameixa',
      subtitulo: 'Loção Hidratante, 200 ml',
      categoria: 'Hidratante corporal',
      preco: 49.90,
      avaliacao: '★★★★☆',
      totalAvaliacoes: 732
    },
    {
      id: 4,
      nome: 'Lily',
      subtitulo: 'Creme Acetinado, 250 g',
      categoria: 'Hidratante corporal',
      preco: 99.90,
      avaliacao: '★★★★☆',
      totalAvaliacoes: 411
    },
    {
      id: 5,
      nome: 'Egeo Dolce',
      subtitulo: 'Desodorante Colônia, 90 ml',
      categoria: 'Perfume',
      preco: 139.90,
      avaliacao: '★★★★☆',
      totalAvaliacoes: 623
    },
    {
      id: 6,
      nome: 'Cuide-se Bem',
      subtitulo: 'Sabonete Líquido, 400 ml',
      categoria: 'Cuidados com o corpo',
      preco: 39.90,
      avaliacao: '★★★★☆',
      totalAvaliacoes: 298
    }
  ];

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>(this.carregar(this.STORAGE_CARRINHO, [
    { produto: this.catalogo[0], quantidade: 1 },
    { produto: this.catalogo[2], quantidade: 1 }
  ]));
  carrinho$ = this.carrinhoSubject.asObservable();

  private pedidosSubject = new BehaviorSubject<Pedido[]>(this.carregar(this.STORAGE_PEDIDOS, [
    {
      numero: '#OB123456789',
      data: '18 de Out. de 2024',
      status: 'Em andamento',
      previsao: '22 de Out. de 2024',
      etapaAtual: 2,
      itens: [
        { nome: 'Floratta Cerejeira em Flor', quantidade: 1 },
        { nome: 'Nativa SPA Ameixa', quantidade: 1 }
      ],
      total: 179.80
    }
  ]));
  pedidos$ = this.pedidosSubject.asObservable();

  private clientelasSubject = new BehaviorSubject<Clientela[]>(this.carregar(this.STORAGE_CLIENTELAS, [
    { id: 1, nome: 'Mariana Silva', email: 'mariana@email.com', telefone: '(11) 98888-1111', cidade: 'São Paulo - SP', pedidosFeitos: 4 },
    { id: 2, nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(11) 97777-2222', cidade: 'Mauá - SP', pedidosFeitos: 2 },
    { id: 3, nome: 'Camila Costa', email: 'camila@email.com', telefone: '(11) 96666-3333', cidade: 'Santo André - SP', pedidosFeitos: 5 }
  ]));
  clientelas$ = this.clientelasSubject.asObservable();

  private carregar<T>(chave: string, padrao: T): T {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo ? JSON.parse(salvo) : padrao;
    } catch {
      return padrao;
    }
  }

  adicionarProduto(produto: ProdutoLoja, quantidade: number = 1): void {
    const atual = [...this.carrinhoSubject.value];
    const existente = atual.find(i => i.produto.id === produto.id);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      atual.push({ produto, quantidade });
    }

    localStorage.setItem(this.STORAGE_CARRINHO, JSON.stringify(atual));
    this.carrinhoSubject.next(atual);
  }

  alterarQuantidade(produtoId: number, delta: number): void {
    const atual = [...this.carrinhoSubject.value];
    const item = atual.find(i => i.produto.id === produtoId);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
      this.removerItem(produtoId);
    } else {
      localStorage.setItem(this.STORAGE_CARRINHO, JSON.stringify(atual));
      this.carrinhoSubject.next(atual);
    }
  }

  removerItem(produtoId: number): void {
    const filtrado = this.carrinhoSubject.value.filter(i => i.produto.id !== produtoId);
    localStorage.setItem(this.STORAGE_CARRINHO, JSON.stringify(filtrado));
    this.carrinhoSubject.next(filtrado);
  }

  finalizarCompra(totalFinal: number): Pedido | null {
    const itensCarrinho = this.carrinhoSubject.value;
    if (itensCarrinho.length === 0) return null;

    const novoPedido: Pedido = {
      numero: '#OB' + Math.floor(100000000 + Math.random() * 900000000),
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Em andamento',
      previsao: 'Em até 5 dias úteis',
      etapaAtual: 1,
      itens: itensCarrinho.map(i => ({ nome: i.produto.nome, quantidade: i.quantidade })),
      total: totalFinal
    };

    const novosPedidos = [novoPedido, ...this.pedidosSubject.value];
    localStorage.setItem(this.STORAGE_PEDIDOS, JSON.stringify(novosPedidos));
    this.pedidosSubject.next(novosPedidos);

    localStorage.setItem(this.STORAGE_CARRINHO, JSON.stringify([]));
    this.carrinhoSubject.next([]);
    return novoPedido;
  }

  adicionarClientela(nova: Omit<Clientela, 'id'>): void {
    const lista = [...this.clientelasSubject.value, { ...nova, id: Date.now() }];
    localStorage.setItem(this.STORAGE_CLIENTELAS, JSON.stringify(lista));
    this.clientelasSubject.next(lista);
  }

  removerClientela(id: number): void {
    const lista = this.clientelasSubject.value.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_CLIENTELAS, JSON.stringify(lista));
    this.clientelasSubject.next(lista);
  }

  obterUsuarioLogado(): string {
    return localStorage.getItem('usuarioLogado') || 'Visitante';
  }
}