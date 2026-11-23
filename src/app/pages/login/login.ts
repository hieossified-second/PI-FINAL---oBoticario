import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  perfil: 'cliente' | 'admin' = 'cliente';
  nome = '';
  email = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const perfilSalvo = localStorage.getItem('perfilUsuario');
    if (perfilSalvo === 'admin' || perfilSalvo === 'cliente') {
      this.perfil = perfilSalvo;
    }

    const nomeSalvo = localStorage.getItem('usuarioLogado');
    if (nomeSalvo && nomeSalvo !== 'Visitante') {
      this.nome = nomeSalvo;
    }
  }

  selecionarPerfil(tipo: 'cliente' | 'admin'): void {
    this.perfil = tipo;
    this.erro = '';
  }

  entrar(): void {
    if (!this.email.trim() || !this.senha.trim()) {
      this.erro = 'Preencha seu e-mail e sua senha para continuar.';
      return;
    }

    const nomeExibicao =
      this.nome.trim() ||
      (this.perfil === 'admin' ? 'Administrador' : this.email.split('@')[0]);

    localStorage.setItem('usuarioLogado', nomeExibicao);
    localStorage.setItem('emailUsuario', this.email.trim());
    localStorage.setItem('perfilUsuario', this.perfil);

    if (this.perfil === 'admin') {
      this.router.navigate(['/inicio-adm']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}