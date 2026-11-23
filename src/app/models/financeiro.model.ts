export interface TransacaoFinanceira {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: 'Receita' | 'Despesa';
}
