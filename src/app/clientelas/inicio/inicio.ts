import { MenuLoja } from '../../components/menu-loja/menu-loja';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LojaService, ProdutoLoja } from '../../services/loja.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuLoja],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  usuario = 'Visitante';
  termoBusca = '';
  totalCarrinho = 0;
  produtos: ProdutoLoja[] = [];

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.usuario = this.lojaService.obterUsuarioLogado();
    this.produtos = this.lojaService.catalogo;

    this.lojaService.carrinho$.subscribe(itens => {
      this.totalCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0);
    });
  }

  get produtosFiltrados(): ProdutoLoja[] {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) return this.produtos;
    return this.produtos.filter(p =>
      p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
    );
  }

  adicionar(produto: ProdutoLoja): void {
    this.lojaService.adicionarProduto(produto, 1);
    alert(`${produto.nome} adicionado ao carrinho!`);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}