import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuLoja } from '../../components/menu-loja/menu-loja';
import { LojaService, ProdutoLoja } from '../../services/loja.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuLoja],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {
  usuario = 'Visitante';
  termoBusca = '';
  totalCarrinho = 0;

  produtoPrincipal!: ProdutoLoja;
  sugestoes: ProdutoLoja[] = [];

  fotoAtiva = 0;
  quantidade = 1;
  favorito = false;
  abaSugestao = 0;
  cep = '';
  resultadoFrete = '';

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.usuario = this.lojaService.obterUsuarioLogado();
    this.produtoPrincipal = this.lojaService.catalogo[0];
    this.sugestoes = this.lojaService.catalogo.slice(1, 6);

    this.lojaService.carrinho$.subscribe(itens => {
      this.totalCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0);
    });
  }

  mudarFoto(delta: number): void {
    this.fotoAtiva = (this.fotoAtiva + delta + 5) % 5;
  }

  alterarQtd(delta: number): void {
    if (this.quantidade + delta >= 1) {
      this.quantidade += delta;
    }
  }

  selecionarProduto(prod: ProdutoLoja): void {
    this.produtoPrincipal = prod;
    this.quantidade = 1;
    this.fotoAtiva = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  adicionarPrincipal(): void {
    this.lojaService.adicionarProduto(this.produtoPrincipal, this.quantidade);
    alert(`${this.quantidade}x ${this.produtoPrincipal.nome} adicionado ao carrinho!`);
  }

  adicionarSugestao(prod: ProdutoLoja): void {
    this.lojaService.adicionarProduto(prod, 1);
    alert(`${prod.nome} adicionado ao carrinho!`);
  }

  calcularFrete(): void {
    if (this.cep.replace(/\D/g, '').length < 8) {
      this.resultadoFrete = 'Digite um CEP válido com 8 números.';
      return;
    }
    this.resultadoFrete = 'Entrega Normal: R\$ 12,90 (3 a 5 dias úteis) • Grátis acima de R\$ 199,00';
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}