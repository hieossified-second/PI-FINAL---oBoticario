export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar: string;
  telefone: string;
  status: 'Ativo' | 'Inativo';
  dataCriacao: string;

  // Variáveis dinâmicas e personalizáveis pelo usuário
  nomeLoja: string;
  fraseBanner: string;
  subtituloBanner: string;
  metaVendas: number;
  metaFaturamento: number;
  percentualCrescimentoVendas: number;
  percentualCrescimentoFaturamento: number;
  percentualCrescimentoTicket: number;
  percentualCrescimentoReceita: number;
  percentualCrescimentoDespesas: number;
  percentualCrescimentoLucro: number;
}
