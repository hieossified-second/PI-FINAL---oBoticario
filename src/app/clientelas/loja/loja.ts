import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenuLoja } from '../../components/menu-loja/menu-loja';
import { ItemCarrinho, LojaService, ProdutoLoja } from '../../services/loja.service';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuLoja],
  templateUrl: './loja.html',
  styleUrl: './loja.css'
})
export class Loja implements OnInit {
  usuario = 'Visitante';
  itens: ItemCarrinho[] = [];
  sugestoes: ProdutoLoja[] = [];

  codigoCupom = '';
  cupomAplicado = false;

  constructor(private lojaService: LojaService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.lojaService.obterUsuarioLogado();
    this.sugestoes = this.lojaService.catalogo.slice(2, 6);

    this.lojaService.carrinho$.subscribe(lista => {
      this.itens = lista;
    });
  }

  get totalItens(): number {
    return this.itens.reduce((acc, i) => acc + i.quantidade, 0);
  }

  get subtotal(): number {
    return this.itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  }

  get valorFrete(): number {
    if (this.subtotal === 0 || this.subtotal >= 199) return 0;
    return 15;
  }

  get descontoCupom(): number {
    return this.cupomAplicado ? this.subtotal * 0.1 : 0;
  }

  get totalFinal(): number {
    return Math.max(0, this.subtotal + this.valorFrete - this.descontoCupom);
  }

  alterarQtd(produtoId: number, delta: number): void {
    this.lojaService.alterarQuantidade(produtoId, delta);
  }

  remover(produtoId: number): void {
    this.lojaService.removerItem(produtoId);
  }

  adicionarSugestao(prod: ProdutoLoja): void {
    this.lojaService.adicionarProduto(prod, 1);
  }

  aplicarCupom(): void {
    if (this.codigoCupom.trim().toUpperCase() === 'BOTI10') {
      this.cupomAplicado = true;
      alert('Cupom BOTI10 aplicado! 10% de desconto.');
    } else {
      alert('Cupom inválido. Tente o cupom BOTI10.');
    }
  }

  finalizarCompra(): void {
    if (this.itens.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const pedido = this.lojaService.finalizarCompra(this.totalFinal);
    if (pedido) {
      alert(`Compra realizada com sucesso! Pedido ${pedido.numero}`);
      this.router.navigate(['/meus-pedidos']);
    }
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}