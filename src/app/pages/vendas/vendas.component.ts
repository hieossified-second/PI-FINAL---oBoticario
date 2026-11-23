import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { UsuarioModalComponent } from '../../components/usuario-modal/usuario-modal.component';
import { DatabaseService } from '../../services/database.service';
import { Cliente } from '../../models/cliente.model';
import { Produto } from '../../models/produto.model';
import { Venda, ItemCarrinho } from '../../models/venda.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, UsuarioModalComponent],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.css'
})
export class VendasComponent implements OnInit {
  usuarioAtual!: Usuario;
  modalUsuarioAberto = false;

  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  vendas: Venda[] = [];
  vendasFiltradas: Venda[] = [];
  termoBusca: string = '';

  // Estatísticas dinâmicas
  totalVendas: number = 0;
  faturamentoTotal: number = 0;
  ticketMedio: number = 0;

  // Formulário de registro de venda
  clienteSelecionadoId: string = '';
  produtoSelecionadoId: string = '';
  quantidade: number = 1;

  // Carrinho de compras
  carrinho: ItemCarrinho[] = [];
  totalCarrinho: number = 0;

  // Feedback
  mensagemAlerta: string = '';

  constructor(public db: DatabaseService) { }

  ngOnInit(): void {
    this.db.usuarioAtual$.subscribe(usr => {
      this.usuarioAtual = usr;
    });

    this.db.clientes$.subscribe(lista => {
      this.clientes = lista;
      if (!this.clienteSelecionadoId && lista.length > 0) {
        this.clienteSelecionadoId = lista[0].id;
      }
    });

    this.db.produtos$.subscribe(lista => {
      this.produtos = lista;
    });

    this.db.vendas$.subscribe(lista => {
      this.vendas = lista;
      this.atualizarEstatisticas();
      this.filtrarVendas();
    });
  }

  atualizarEstatisticas(): void {
    const est = this.db.obterEstatisticasVendas();
    this.totalVendas = est.totalVendas;
    this.faturamentoTotal = est.faturamento;
    this.ticketMedio = est.ticketMedio;
  }

  filtrarVendas(): void {
    if (!this.termoBusca.trim()) {
      this.vendasFiltradas = [...this.vendas];
      return;
    }
    const termo = this.termoBusca.toLowerCase().trim();
    this.vendasFiltradas = this.vendas.filter(v =>
      v.clienteNome.toLowerCase().includes(termo) ||
      v.descricaoProdutos.toLowerCase().includes(termo) ||
      v.data.includes(termo) ||
      v.status.toLowerCase().includes(termo)
    );
  }

  obterProdutoSelecionado(): Produto | undefined {
    return this.produtos.find(p => p.id === this.produtoSelecionadoId);
  }

  obterEstoqueDisponivel(): number {
    const prod = this.obterProdutoSelecionado();
    if (!prod) return 0;
    const jaNoCarrinho = this.carrinho.find(i => i.produtoId === prod.id)?.quantidade || 0;
    return Math.max(0, prod.estoque - jaNoCarrinho);
  }

  adicionarAoCarrinho(): void {
    if (!this.clienteSelecionadoId) {
      alert('Por favor, selecione um cliente.');
      return;
    }

    if (!this.produtoSelecionadoId) {
      alert('Por favor, selecione um produto.');
      return;
    }

    if (this.quantidade < 1) {
      alert('A quantidade deve ser no mínimo 1.');
      return;
    }

    const produto = this.obterProdutoSelecionado();
    if (!produto) {
      alert('Produto não encontrado.');
      return;
    }

    // Validação de estoque disponível
    const itemExistente = this.carrinho.find(i => i.produtoId === produto.id);
    const qtdJaNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
    const qtdTotalDesejada = qtdJaNoCarrinho + this.quantidade;

    if (qtdTotalDesejada > produto.estoque) {
      alert(`Estoque insuficiente! Disponível em estoque: ${produto.estoque} unidades.`);
      return;
    }

    if (itemExistente) {
      itemExistente.quantidade += this.quantidade;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
    } else {
      this.carrinho.push({
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.valor,
        quantidade: this.quantidade,
        subtotal: produto.valor * this.quantidade
      });
    }

    this.calcularTotalCarrinho();
    this.produtoSelecionadoId = '';
    this.quantidade = 1;
  }

  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
    this.calcularTotalCarrinho();
  }

  limparCarrinho(): void {
    this.carrinho = [];
    this.totalCarrinho = 0;
  }

  calcularTotalCarrinho(): void {
    this.totalCarrinho = this.carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  }

  finalizarVenda(): void {
    if (this.carrinho.length === 0) {
      alert('Adicione ao menos um produto ao carrinho antes de finalizar a venda.');
      return;
    }

    const cliente = this.clientes.find(c => c.id === this.clienteSelecionadoId);
    const clienteNome = cliente ? cliente.nome : 'Consumidor Avulso';

    // Cria a venda no banco JSON e abate estoque
    const novaVenda = this.db.createVenda({
      clienteId: this.clienteSelecionadoId,
      clienteNome: clienteNome,
      itens: [...this.carrinho],
      valorTotal: this.totalCarrinho,
      status: 'Concluída'
    });

    alert(
      `🎉 Venda finalizada e registrada no banco de dados com sucesso!\n\n` +
      `Código: #${novaVenda.id.slice(-6)}\n` +
      `Cliente: ${clienteNome}\n` +
      `Total: ${this.formatarMoeda(this.totalCarrinho)}\n` +
      `O estoque dos produtos e o fluxo financeiro foram atualizados automaticamente.`
    );

    this.limparCarrinho();
  }

  imprimir(): void {
    window.print();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  abrirModalUsuario(): void {
    this.modalUsuarioAberto = true;
  }

  fecharModalUsuario(): void {
    this.modalUsuarioAberto = false;
  }
}
