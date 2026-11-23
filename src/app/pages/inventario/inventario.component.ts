import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { UsuarioModalComponent } from '../../components/usuario-modal/usuario-modal.component';
import { DatabaseService } from '../../services/database.service';
import { Produto } from '../../models/produto.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, UsuarioModalComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  usuarioAtual!: Usuario;
  modalUsuarioAberto = false;

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  termoBusca: string = '';
  categoriaSelecionada: string = 'Todas as categorias';
  categorias: string[] = ['Todas as categorias', 'Perfumaria', 'Cuidados Pessoais', 'Cabelos', 'Kits', 'Maquiagem'];

  stats = {
    totalEstoque: 0,
    baixoEstoque: 0,
    semEstoque: 0
  };

  // Modal de Produto
  modalAberto: boolean = false;
  modoEdicao: boolean = false;
  produtoEditandoId: string | null = null;
  produtoForm: Omit<Produto, 'id'> = {
    nome: '',
    categoria: 'Perfumaria',
    estoque: 10,
    estoqueMinimo: 10,
    valor: 0,
    cor: '#E9A9A5'
  };

  coresDisponiveis = [
    { nome: 'Rosa Claro', hex: '#E9A9A5' },
    { nome: 'Preto Elegante', hex: '#1A1A1A' },
    { nome: 'Vinho Ameixa', hex: '#8E2F3E' },
    { nome: 'Pêssego', hex: '#F0B5B0' },
    { nome: 'Vermelho Intenso', hex: '#D9344A' },
    { nome: 'Cinza Carvão', hex: '#242424' },
    { nome: 'Verde Oliva', hex: '#558B2F' },
    { nome: 'Dourado / Mostarda', hex: '#D4A017' }
  ];

  constructor(public db: DatabaseService) { }

  ngOnInit(): void {
    this.db.usuarioAtual$.subscribe(usr => {
      this.usuarioAtual = usr;
    });

    this.db.produtos$.subscribe(lista => {
      this.produtos = lista;
      this.atualizarEstatisticas();
      this.filtrarProdutos();
    });
  }

  atualizarEstatisticas(): void {
    const est = this.db.obterEstatisticasInventario();
    this.stats = {
      totalEstoque: est.totalEstoque,
      baixoEstoque: est.baixoEstoque,
      semEstoque: est.semEstoque
    };
  }

  filtrarProdutos(): void {
    let resultado = [...this.produtos];

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo)
      );
    }

    if (this.categoriaSelecionada !== 'Todas as categorias') {
      resultado = resultado.filter(p => p.categoria === this.categoriaSelecionada);
    }

    this.produtosFiltrados = resultado;
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.produtoEditandoId = null;
    this.produtoForm = {
      nome: '',
      categoria: 'Perfumaria',
      estoque: 10,
      estoqueMinimo: 10,
      valor: 99.90,
      cor: '#E9A9A5'
    };
    this.modalAberto = true;
  }

  abrirModalEditar(produto: Produto): void {
    this.modoEdicao = true;
    this.produtoEditandoId = produto.id;
    this.produtoForm = {
      nome: produto.nome,
      categoria: produto.categoria,
      estoque: produto.estoque,
      estoqueMinimo: produto.estoqueMinimo || 10,
      valor: produto.valor,
      cor: produto.cor || '#E9A9A5'
    };
    this.modalAberto = true;
  }

  salvarProduto(): void {
    if (!this.produtoForm.nome.trim()) {
      alert('Por favor, informe o nome do produto.');
      return;
    }

    if (this.produtoForm.valor < 0) {
      alert('O valor do produto não pode ser negativo.');
      return;
    }

    if (this.modoEdicao && this.produtoEditandoId) {
      this.db.updateProduto(this.produtoEditandoId, this.produtoForm);
    } else {
      this.db.createProduto(this.produtoForm);
    }

    this.fecharModal();
  }

  excluirProduto(id: string): void {
    if (confirm('Deseja realmente remover este produto do inventário?')) {
      this.db.deleteProduto(id);
    }
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modoEdicao = false;
    this.produtoEditandoId = null;
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
