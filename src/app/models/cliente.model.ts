export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  tipo: 'Pessoa física' | 'Pessoa jurídica';
  dataCadastro: string;
}
