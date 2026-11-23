import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuLoja } from '../../components/menu-loja/menu-loja';
import { LojaService, Pedido } from '../../services/loja.service';
@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuLoja],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos implements OnInit {
  usuario = 'Visitante';
  totalCarrinho = 0;
  pedidos: Pedido[] = [];

  filtroStatus: 'Todos' | 'Em andamento' | 'Entregue' | 'Cancelado' = 'Todos';
  termoBusca = '';

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.usuario = this.lojaService.obterUsuarioLogado();

    this.lojaService.carrinho$.subscribe(itens => {
      this.totalCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0);
    });

    this.lojaService.pedidos$.subscribe(lista => {
      this.pedidos = lista;
    });
  }

  get pedidosFiltrados(): Pedido[] {
    const termo = this.termoBusca.toLowerCase().trim();
    return this.pedidos.filter(p => {
      const bateStatus = this.filtroStatus === 'Todos' || p.status === this.filtroStatus;
      const bateBusca =
        !termo ||
        p.numero.toLowerCase().includes(termo) ||
        p.itens.some(i => i.nome.toLowerCase().includes(termo));
      return bateStatus && bateBusca;
    });
  }

  contarPorStatus(status: 'Em andamento' | 'Entregue' | 'Cancelado'): number {
    return this.pedidos.filter(p => p.status === status).length;
  }

  comprarNovamente(pedido: Pedido): void {
    pedido.itens.forEach(item => {
      const produtoEncontrado = this.lojaService.catalogo.find(p => p.nome === item.nome);
      if (produtoEncontrado) {
        this.lojaService.adicionarProduto(produtoEncontrado, item.quantidade);
      }
    });
    alert(`Os itens do pedido ${pedido.numero} foram adicionados novamente ao seu carrinho!`);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
