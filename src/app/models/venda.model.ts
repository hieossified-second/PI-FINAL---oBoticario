export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  clienteId?: string;
  clienteNome: string;
  data: string;
  itens: ItemCarrinho[];
  descricaoProdutos: string;
  valorTotal: number;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
}
