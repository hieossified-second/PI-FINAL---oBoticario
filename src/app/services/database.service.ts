import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Cliente } from '../models/cliente.model';
import { Produto } from '../models/produto.model';
import { Venda, ItemCarrinho } from '../models/venda.model';
import { TransacaoFinanceira } from '../models/financeiro.model';
import {
  DEFAULT_USUARIOS,
  DEFAULT_CLIENTES,
  DEFAULT_PRODUTOS,
  DEFAULT_VENDAS,
  DEFAULT_FINANCEIRO
} from '../data/default-data';

export interface BoticarioDatabase {
  version: string;
  usuarioAtualId: string;
  usuarios: Usuario[];
  clientes: Cliente[];
  produtos: Produto[];
  vendas: Venda[];
  financeiro: TransacaoFinanceira[];
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly DB_KEY = 'boticario_db_v1';

  // BehaviorSubjects para reatividade em tempo real
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  private usuarioAtualSubject = new BehaviorSubject<Usuario>(DEFAULT_USUARIOS[0]);
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private produtosSubject = new BehaviorSubject<Produto[]>([]);
  private vendasSubject = new BehaviorSubject<Venda[]>([]);
  private financeiroSubject = new BehaviorSubject<TransacaoFinanceira[]>([]);

  // Observables públicos
  public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();
  public usuarioAtual$: Observable<Usuario> = this.usuarioAtualSubject.asObservable();
  public clientes$: Observable<Cliente[]> = this.clientesSubject.asObservable();
  public produtos$: Observable<Produto[]> = this.produtosSubject.asObservable();
  public vendas$: Observable<Venda[]> = this.vendasSubject.asObservable();
  public financeiro$: Observable<TransacaoFinanceira[]> = this.financeiroSubject.asObservable();

  constructor() {
    this.carregarOuInicializarBanco();
  }

  // ==========================================
  // INICIALIZAÇÃO E PERSISTÊNCIA JSON
  // ==========================================
  private carregarOuInicializarBanco(): void {
    try {
      const dadosSalvos = typeof localStorage !== 'undefined' ? localStorage.getItem(this.DB_KEY) : null;
      if (dadosSalvos) {
        const db: BoticarioDatabase = JSON.parse(dadosSalvos);
        this.atualizarSubjects(db);
        return;
      }
    } catch (e) {
      console.warn('Erro ao ler banco do localStorage, carregando sementes padrão.', e);
    }

    // Inicialização com dados padrão
    const dbInicial: BoticarioDatabase = {
      version: '1.0.0',
      usuarioAtualId: DEFAULT_USUARIOS[0].id,
      usuarios: [...DEFAULT_USUARIOS],
      clientes: [...DEFAULT_CLIENTES],
      produtos: [...DEFAULT_PRODUTOS],
      vendas: [...DEFAULT_VENDAS],
      financeiro: [...DEFAULT_FINANCEIRO]
    };

    this.salvarEstado(dbInicial);
    this.atualizarSubjects(dbInicial);
  }

  private obterEstadoAtual(): BoticarioDatabase {
    return {
      version: '1.0.0',
      usuarioAtualId: this.usuarioAtualSubject.value.id,
      usuarios: this.usuariosSubject.value,
      clientes: this.clientesSubject.value,
      produtos: this.produtosSubject.value,
      vendas: this.vendasSubject.value,
      financeiro: this.financeiroSubject.value
    };
  }

  private salvarEstado(db: BoticarioDatabase): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.DB_KEY, JSON.stringify(db, null, 2));
    }
  }

  private atualizarSubjects(db: BoticarioDatabase): void {
    this.usuariosSubject.next(db.usuarios || []);
    this.clientesSubject.next(db.clientes || []);
    this.produtosSubject.next(db.produtos || []);
    this.vendasSubject.next(db.vendas || []);
    this.financeiroSubject.next(db.financeiro || []);

    const userAtual = (db.usuarios || []).find(u => u.id === db.usuarioAtualId) || db.usuarios?.[0] || DEFAULT_USUARIOS[0];
    this.usuarioAtualSubject.next(userAtual);
  }

  // ==========================================
  // OPERAÇÕES: USUÁRIOS
  // ==========================================
  getUsuarios(): Usuario[] {
    return this.usuariosSubject.value;
  }

  getUsuarioAtual(): Usuario {
    return this.usuarioAtualSubject.value;
  }

  setUsuarioAtual(id: string): void {
    const usuario = this.usuariosSubject.value.find(u => u.id === id);
    if (usuario) {
      this.usuarioAtualSubject.next(usuario);
      const db = this.obterEstadoAtual();
      db.usuarioAtualId = id;
      this.salvarEstado(db);
    }
  }

  getUsuarioById(id: string): Usuario | undefined {
    return this.usuariosSubject.value.find(u => u.id === id);
  }

  createUsuario(dados: Omit<Usuario, 'id'>): Usuario {
    const novoUsuario: Usuario = {
      ...dados,
      id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    };
    const lista = [novoUsuario, ...this.usuariosSubject.value];
    this.usuariosSubject.next(lista);

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return novoUsuario;
  }

  updateUsuario(id: string, dados: Partial<Usuario>): Usuario | undefined {
    const lista = this.usuariosSubject.value.map(user => {
      if (user.id === id) {
        return { ...user, ...dados };
      }
      return user;
    });

    this.usuariosSubject.next(lista);
    const atualizado = lista.find(u => u.id === id);

    if (this.usuarioAtualSubject.value.id === id && atualizado) {
      this.usuarioAtualSubject.next(atualizado);
    }

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return atualizado;
  }

  deleteUsuario(id: string): boolean {
    const lista = this.usuariosSubject.value.filter(u => u.id !== id);
    if (lista.length === this.usuariosSubject.value.length) return false;

    this.usuariosSubject.next(lista);

    // Se deletou o usuário atual, chaveia para o primeiro restante
    if (this.usuarioAtualSubject.value.id === id && lista.length > 0) {
      this.usuarioAtualSubject.next(lista[0]);
    }

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return true;
  }

  // ==========================================
  // OPERAÇÕES: CLIENTES
  // ==========================================
  getClientes(): Cliente[] {
    return this.clientesSubject.value;
  }

  getClienteById(id: string): Cliente | undefined {
    return this.clientesSubject.value.find(c => c.id === id);
  }

  createCliente(dados: Omit<Cliente, 'id'>): Cliente {
    const novoCliente: Cliente = {
      ...dados,
      id: 'cli-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    };
    const lista = [novoCliente, ...this.clientesSubject.value];
    this.clientesSubject.next(lista);

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return novoCliente;
  }

  updateCliente(id: string, dados: Partial<Cliente>): Cliente | undefined {
    const lista = this.clientesSubject.value.map(cli => {
      if (cli.id === id) {
        return { ...cli, ...dados };
      }
      return cli;
    });

    this.clientesSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return lista.find(c => c.id === id);
  }

  deleteCliente(id: string): boolean {
    const lista = this.clientesSubject.value.filter(c => c.id !== id);
    if (lista.length === this.clientesSubject.value.length) return false;

    this.clientesSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return true;
  }

  // ==========================================
  // OPERAÇÕES: PRODUTOS / INVENTÁRIO
  // ==========================================
  getProdutos(): Produto[] {
    return this.produtosSubject.value;
  }

  getProdutoById(id: string): Produto | undefined {
    return this.produtosSubject.value.find(p => p.id === id);
  }

  createProduto(dados: Omit<Produto, 'id'>): Produto {
    const coresPadrao = ['#E9A9A5', '#1A1A1A', '#8E2F3E', '#F0B5B0', '#D9344A', '#242424', '#558B2F'];
    const cor = dados.cor || coresPadrao[Math.floor(Math.random() * coresPadrao.length)];

    const novoProduto: Produto = {
      ...dados,
      cor,
      id: 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    };
    const lista = [novoProduto, ...this.produtosSubject.value];
    this.produtosSubject.next(lista);

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return novoProduto;
  }

  updateProduto(id: string, dados: Partial<Produto>): Produto | undefined {
    const lista = this.produtosSubject.value.map(prod => {
      if (prod.id === id) {
        return { ...prod, ...dados };
      }
      return prod;
    });

    this.produtosSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return lista.find(p => p.id === id);
  }

  deleteProduto(id: string): boolean {
    const lista = this.produtosSubject.value.filter(p => p.id !== id);
    if (lista.length === this.produtosSubject.value.length) return false;

    this.produtosSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return true;
  }

  abaterEstoque(produtoId: string, quantidade: number): boolean {
    const produto = this.getProdutoById(produtoId);
    if (!produto || produto.estoque < quantidade) return false;

    this.updateProduto(produtoId, {
      estoque: produto.estoque - quantidade
    });
    return true;
  }

  // ==========================================
  // OPERAÇÕES: VENDAS
  // ==========================================
  getVendas(): Venda[] {
    return this.vendasSubject.value;
  }

  createVenda(dados: {
    clienteId?: string;
    clienteNome: string;
    itens: ItemCarrinho[];
    valorTotal: number;
    status?: 'Concluída' | 'Pendente' | 'Cancelada';
  }): Venda {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const descricoes = dados.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');

    const novaVenda: Venda = {
      id: 'ven-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      clienteId: dados.clienteId,
      clienteNome: dados.clienteNome,
      data: dataFormatada,
      itens: dados.itens,
      descricaoProdutos: descricoes || 'Diversos produtos',
      valorTotal: dados.valorTotal,
      status: dados.status || 'Concluída'
    };

    // 1. Abate estoque de cada produto vendido
    dados.itens.forEach(item => {
      this.abaterEstoque(item.produtoId, item.quantidade);
    });

    // 2. Adiciona a venda ao histórico
    const listaVendas = [novaVenda, ...this.vendasSubject.value];
    this.vendasSubject.next(listaVendas);

    // 3. Registra movimentação financeira de Receita automaticamente
    this.createTransacao({
      data: dataFormatada,
      descricao: `Venda #${novaVenda.id.slice(-4)} - ${dados.clienteNome}`,
      categoria: 'Vendas',
      valor: dados.valorTotal,
      tipo: 'Receita'
    });

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return novaVenda;
  }

  deleteVenda(id: string): boolean {
    const lista = this.vendasSubject.value.filter(v => v.id !== id);
    if (lista.length === this.vendasSubject.value.length) return false;

    this.vendasSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return true;
  }

  // ==========================================
  // OPERAÇÕES: FINANCEIRO
  // ==========================================
  getTransacoes(): TransacaoFinanceira[] {
    return this.financeiroSubject.value;
  }

  createTransacao(dados: Omit<TransacaoFinanceira, 'id'>): TransacaoFinanceira {
    const novaTransacao: TransacaoFinanceira = {
      ...dados,
      id: 'mov-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    };

    const lista = [novaTransacao, ...this.financeiroSubject.value];
    this.financeiroSubject.next(lista);

    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return novaTransacao;
  }

  deleteTransacao(id: string): boolean {
    const lista = this.financeiroSubject.value.filter(t => t.id !== id);
    if (lista.length === this.financeiroSubject.value.length) return false;

    this.financeiroSubject.next(lista);
    const db = this.obterEstadoAtual();
    this.salvarEstado(db);
    return true;
  }

  // ==========================================
  // ESTATÍSTICAS E UTILITÁRIOS GERAIS
  // ==========================================
  obterEstatisticasInventario() {
    const produtos = this.produtosSubject.value;
    const totalEstoque = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0);
    const baixoEstoque = produtos.filter(p => p.estoque > 0 && p.estoque <= (p.estoqueMinimo || 10)).length;
    const semEstoque = produtos.filter(p => p.estoque <= 0).length;

    return {
      totalEstoque,
      baixoEstoque,
      semEstoque,
      totalItensCadastrados: produtos.length
    };
  }

  obterEstatisticasVendas() {
    const vendas = this.vendasSubject.value;
    const totalVendas = vendas.length;
    const faturamento = vendas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
    const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

    return {
      totalVendas,
      faturamento,
      ticketMedio
    };
  }

  obterResumoFinanceiro() {
    const transacoes = this.financeiroSubject.value;
    const receitaTotal = transacoes
      .filter(t => t.tipo === 'Receita')
      .reduce((acc, t) => acc + t.valor, 0);

    const despesasTotal = transacoes
      .filter(t => t.tipo === 'Despesa')
      .reduce((acc, t) => acc + t.valor, 0);

    const lucroLiquido = receitaTotal - despesasTotal;

    return {
      receitaTotal,
      despesasTotal,
      lucroLiquido,
      porReceita: 15,
      porDespesas: 8,
      porLucro: 18
    };
  }

  // ==========================================
  // IMPORTAÇÃO / EXPORTAÇÃO COMPLETA DO BANCO JSON
  // ==========================================
  exportarBancoJson(): string {
    const db = this.obterEstadoAtual();
    return JSON.stringify(db, null, 2);
  }

  importarBancoJson(conteudoJson: string): boolean {
    try {
      const db: BoticarioDatabase = JSON.parse(conteudoJson);
      if (!Array.isArray(db.usuarios) || !Array.isArray(db.clientes) || !Array.isArray(db.produtos)) {
        throw new Error('Formato inválido do arquivo JSON do banco');
      }

      this.salvarEstado(db);
      this.atualizarSubjects(db);
      return true;
    } catch (err) {
      console.error('Falha ao importar JSON do banco:', err);
      return false;
    }
  }

  resetarBancoParaPadrao(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.DB_KEY);
    }
    this.carregarOuInicializarBanco();
  }
}
