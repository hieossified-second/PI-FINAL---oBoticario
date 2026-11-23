import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  perfil: 'cliente' | 'admin' = 'cliente';
  nome = '';
  email = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

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

    // Salva no localStorage para o LojaService e o painel exibirem o nome
    localStorage.setItem('usuarioLogado', nomeExibicao);
    localStorage.setItem('perfilUsuario', this.perfil);

    if (this.perfil === 'admin') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}