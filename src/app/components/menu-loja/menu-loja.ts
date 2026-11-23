import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LojaService } from '../../services/loja.service';
@Component({
  selector: 'app-menu-loja',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-loja.html',
  styleUrl: './menu-loja.css'
})
export class MenuLoja implements OnInit {
  totalItens = 0;

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.lojaService.carrinho$.subscribe(itens => {
      this.totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
    });
  }
}