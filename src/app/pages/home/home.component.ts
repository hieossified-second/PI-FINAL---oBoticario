import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { UsuarioModalComponent } from '../../components/usuario-modal/usuario-modal.component';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../models/usuario.model';
import { Venda } from '../../models/venda.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuComponent, UsuarioModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuarioAtual!: Usuario;
  modalUsuarioAberto = false;

  qtdClientes = 0;
  qtdVendas = 0;
  qtdEstoque = 0;
  faturamentoTotal = 0;
  porReceita = 15;

  termoBusca = '';
  ultimasVendas: Venda[] = [];
  ultimasVendasFiltradas: Venda[] = [];

  constructor(public db: DatabaseService) { }

  ngOnInit(): void {
    this.db.usuarioAtual$.subscribe(usr => {
      this.usuarioAtual = usr;
    });

    this.db.clientes$.subscribe(clientes => {
      this.qtdClientes = clientes.length;
    });

    this.db.produtos$.subscribe(produtos => {
      this.qtdEstoque = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0);
    });

    this.db.vendas$.subscribe(vendas => {
      this.qtdVendas = vendas.length;
      this.faturamentoTotal = vendas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
      this.ultimasVendas = vendas.slice(0, 5);
      this.filtrarVendas();
    });

    const fin = this.db.obterResumoFinanceiro();
    this.porReceita = fin.porReceita;
  }

  filtrarVendas(): void {
    if (!this.termoBusca.trim()) {
      this.ultimasVendasFiltradas = [...this.ultimasVendas];
      return;
    }

    const termo = this.termoBusca.toLowerCase().trim();
    this.ultimasVendasFiltradas = this.ultimasVendas.filter(v =>
      v.clienteNome.toLowerCase().includes(termo) ||
      v.descricaoProdutos.toLowerCase().includes(termo) ||
      v.data.includes(termo)
    );
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
