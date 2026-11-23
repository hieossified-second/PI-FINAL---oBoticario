import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { UsuarioModalComponent } from '../../components/usuario-modal/usuario-modal.component';
import { DatabaseService } from '../../services/database.service';
import { Cliente } from '../../models/cliente.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, UsuarioModalComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  usuarioAtual!: Usuario;
  modalUsuarioAberto = false;

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;

  // Filtros dinâmicos
  termoBusca: string = '';
  filtroTipo: string = 'Todos os tipos';
  ordem: string = 'Nome (A-Z)';

  // Modal de cadastro/edição
  modalAberto: boolean = false;
  modoEdicao: boolean = false;
  clienteEditandoId: string | null = null;
  clienteForm: Omit<Cliente, 'id'> = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    tipo: 'Pessoa física',
    dataCadastro: ''
  };

  constructor(public db: DatabaseService) {}

  ngOnInit(): void {
    this.db.usuarioAtual$.subscribe(usr => {
      this.usuarioAtual = usr;
    });

    this.db.clientes$.subscribe(lista => {
      this.clientes = lista;
      this.filtrarClientes();

      if (this.clienteSelecionado) {
        // Mantém a referência atualizada do cliente selecionado
        const atualizado = lista.find(c => c.id === this.clienteSelecionado?.id);
        this.clienteSelecionado = atualizado || (lista.length > 0 ? lista[0] : null);
      } else if (lista.length > 0) {
        this.clienteSelecionado = lista[0];
      }
    });
  }

  filtrarClientes(): void {
    let resultado = [...this.clientes];

    // Filtro por texto (Nome, CPF, Telefone ou E-mail)
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      resultado = resultado.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.cpf.includes(termo) ||
        c.telefone.includes(termo) ||
        c.email.toLowerCase().includes(termo)
      );
    }

    // Filtro por tipo
    if (this.filtroTipo !== 'Todos os tipos') {
      resultado = resultado.filter(c => c.tipo === this.filtroTipo);
    }

    // Ordenação
    if (this.ordem === 'Nome (A-Z)') {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (this.ordem === 'Nome (Z-A)') {
      resultado.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    this.clientesFiltrados = resultado;
  }

  selecionarCliente(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.clienteEditandoId = null;
    const hoje = new Date().toISOString().split('T')[0];
    this.clienteForm = {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      tipo: 'Pessoa física',
      dataCadastro: hoje
    };
    this.modalAberto = true;
  }

  abrirModalEditar(cliente: Cliente, event?: Event): void {
    if (event) event.stopPropagation();
    this.modoEdicao = true;
    this.clienteEditandoId = cliente.id;
    this.clienteForm = {
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email,
      tipo: cliente.tipo,
      dataCadastro: cliente.dataCadastro
    };
    this.modalAberto = true;
  }

  salvarCliente(): void {
    if (!this.clienteForm.nome.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    if (this.modoEdicao && this.clienteEditandoId) {
      this.db.updateCliente(this.clienteEditandoId, this.clienteForm);
    } else {
      const criado = this.db.createCliente(this.clienteForm);
      this.clienteSelecionado = criado;
    }

    this.fecharModal();
  }

  excluirCliente(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Deseja realmente excluir este cliente do sistema?')) {
      this.db.deleteCliente(id);
      if (this.clienteSelecionado?.id === id) {
        this.clienteSelecionado = this.clientesFiltrados[0] || null;
      }
    }
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modoEdicao = false;
    this.clienteEditandoId = null;
  }

  abrirModalUsuario(): void {
    this.modalUsuarioAberto = true;
  }

  fecharModalUsuario(): void {
    this.modalUsuarioAberto = false;
  }
}
