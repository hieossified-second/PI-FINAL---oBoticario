import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseService);
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve carregar os usuários padrão', () => {
    const usuarios = service.getUsuarios();
    expect(usuarios.length).toBeGreaterThan(0);
    expect(usuarios.some(u => u.nome === 'Administrador')).toBeTrue();
  });

  it('deve criar, atualizar e excluir um usuário', () => {
    const novo = service.createUsuario({
      nome: 'Teste Revendedor',
      email: 'teste@boticario.com.br',
      cargo: 'Consultor de Vendas',
      avatar: 'T',
      telefone: '(11) 99999-0000',
      status: 'Ativo',
      dataCriacao: '2026-01-01',
      nomeLoja: 'Minha Loja',
      fraseBanner: 'Frase Teste',
      subtituloBanner: 'Subtitulo Teste',
      metaVendas: 50,
      metaFaturamento: 15000,
      percentualCrescimentoVendas: 8,
      percentualCrescimentoFaturamento: 15,
      percentualCrescimentoTicket: 6,
      percentualCrescimentoReceita: 15,
      percentualCrescimentoDespesas: 8,
      percentualCrescimentoLucro: 18
    });

    expect(novo.id).toBeDefined();
    expect(service.getUsuarioById(novo.id)?.nome).toEqual('Teste Revendedor');

    service.updateUsuario(novo.id, { cargo: 'Revendedor Ouro' });
    expect(service.getUsuarioById(novo.id)?.cargo).toEqual('Revendedor Ouro');

    const deletou = service.deleteUsuario(novo.id);
    expect(deletou).toBeTrue();
    expect(service.getUsuarioById(novo.id)).toBeUndefined();
  });

  it('deve criar, atualizar e excluir um cliente', () => {
    const novo = service.createCliente({
      nome: 'Cliente Teste',
      cpf: '111.222.333-44',
      telefone: '(11) 98888-1111',
      email: 'cliente@teste.com',
      tipo: 'Pessoa física',
      dataCadastro: '2026-01-01'
    });

    expect(novo.id).toBeDefined();
    expect(service.getClienteById(novo.id)?.nome).toEqual('Cliente Teste');

    service.updateCliente(novo.id, { telefone: '(11) 97777-2222' });
    expect(service.getClienteById(novo.id)?.telefone).toEqual('(11) 97777-2222');

    const deletou = service.deleteCliente(novo.id);
    expect(deletou).toBeTrue();
    expect(service.getClienteById(novo.id)).toBeUndefined();
  });

  it('deve criar uma venda e abater o estoque do produto', () => {
    const produto = service.createProduto({
      nome: 'Perfume Teste',
      categoria: 'Perfumaria',
      estoque: 10,
      estoqueMinimo: 2,
      valor: 100.00,
      cor: '#1A1A1A'
    });

    const estoqueInicial = produto.estoque;

    const venda = service.createVenda({
      clienteNome: 'Cliente Comprador',
      itens: [{
        produtoId: produto.id,
        nome: produto.nome,
        preco: 100.00,
        quantidade: 3,
        subtotal: 300.00
      }],
      valorTotal: 300.00
    });

    expect(venda.id).toBeDefined();
    const produtoAtualizado = service.getProdutoById(produto.id);
    expect(produtoAtualizado?.estoque).toEqual(estoqueInicial - 3);

    // Limpa o produto criado
    service.deleteProduto(produto.id);
  });

  it('deve exportar e importar o banco de dados em formato JSON', () => {
    const jsonStr = service.exportarBancoJson();
    expect(jsonStr).toContain('usuarios');
    expect(jsonStr).toContain('clientes');
    expect(jsonStr).toContain('produtos');

    const importou = service.importarBancoJson(jsonStr);
    expect(importou).toBeTrue();
  });
});
