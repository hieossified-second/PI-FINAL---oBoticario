import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.css'
})
export class UsuarioModalComponent implements OnInit {
  @Output() fechar = new EventEmitter<void>();

  usuarios: Usuario[] = [];
  usuarioAtual!: Usuario;

  abaAtiva: 'gerenciar' | 'novo' | 'backup' = 'gerenciar';

  // Formulário de novo/editar usuário
  modoEdicao = false;
  idEditando: string | null = null;
  formUsuario: Omit<Usuario, 'id'> = {
    nome: '',
    email: '',
    cargo: 'Consultor de Vendas',
    avatar: 'U',
    telefone: '',
    status: 'Ativo',
    dataCriacao: new Date().toISOString().split('T')[0],
    nomeLoja: 'oBOTICÁRIO',
    fraseBanner: 'O Boticário é beleza que transforma',
    subtituloBanner: 'Mais do que produtos, entregamos autocuidado, autoestima e bem-estar.',
    metaVendas: 50,
    metaFaturamento: 15000,
    percentualCrescimentoVendas: 8,
    percentualCrescimentoFaturamento: 15,
    percentualCrescimentoTicket: 6,
    percentualCrescimentoReceita: 15,
    percentualCrescimentoDespesas: 8,
    percentualCrescimentoLucro: 18
  };

  mensagemSucesso = '';
  mensagemErro = '';

  constructor(public db: DatabaseService) {}

  ngOnInit(): void {
    this.db.usuarios$.subscribe(users => {
      this.usuarios = users;
    });
    this.db.usuarioAtual$.subscribe(atual => {
      this.usuarioAtual = atual;
    });
  }

  selecionarUsuario(id: string): void {
    this.db.setUsuarioAtual(id);
    this.exibirSucesso('Usuário ativo alterado com sucesso!');
  }

  prepararNovo(): void {
    this.modoEdicao = false;
    this.idEditando = null;
    this.formUsuario = {
      nome: '',
      email: '',
      cargo: 'Consultor(a) de Vendas',
      avatar: 'U',
      telefone: '',
      status: 'Ativo',
      dataCriacao: new Date().toISOString().split('T')[0],
      nomeLoja: 'oBOTICÁRIO',
      fraseBanner: 'O Boticário é beleza que transforma',
      subtituloBanner: 'Mais do que produtos, entregamos autocuidado, autoestima e bem-estar.',
      metaVendas: 50,
      metaFaturamento: 15000,
      percentualCrescimentoVendas: 8,
      percentualCrescimentoFaturamento: 15,
      percentualCrescimentoTicket: 6,
      percentualCrescimentoReceita: 15,
      percentualCrescimentoDespesas: 8,
      percentualCrescimentoLucro: 18
    };
    this.abaAtiva = 'novo';
  }

  editar(usuario: Usuario): void {
    this.modoEdicao = true;
    this.idEditando = usuario.id;
    this.formUsuario = {
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      avatar: usuario.avatar,
      telefone: usuario.telefone,
      status: usuario.status,
      dataCriacao: usuario.dataCriacao,
      nomeLoja: usuario.nomeLoja || 'oBOTICÁRIO',
      fraseBanner: usuario.fraseBanner || 'O Boticário é beleza que transforma',
      subtituloBanner: usuario.subtituloBanner || 'Mais do que produtos, entregamos autocuidado, autoestima e bem-estar.',
      metaVendas: usuario.metaVendas || 50,
      metaFaturamento: usuario.metaFaturamento || 15000,
      percentualCrescimentoVendas: usuario.percentualCrescimentoVendas ?? 8,
      percentualCrescimentoFaturamento: usuario.percentualCrescimentoFaturamento ?? 15,
      percentualCrescimentoTicket: usuario.percentualCrescimentoTicket ?? 6,
      percentualCrescimentoReceita: usuario.percentualCrescimentoReceita ?? 15,
      percentualCrescimentoDespesas: usuario.percentualCrescimentoDespesas ?? 8,
      percentualCrescimentoLucro: usuario.percentualCrescimentoLucro ?? 18
    };
    this.abaAtiva = 'novo';
  }

  salvarUsuario(): void {
    if (!this.formUsuario.nome.trim()) {
      this.exibirErro('O nome do usuário é obrigatório.');
      return;
    }

    if (!this.formUsuario.avatar.trim()) {
      this.formUsuario.avatar = this.formUsuario.nome.charAt(0).toUpperCase();
    }

    if (this.modoEdicao && this.idEditando) {
      this.db.updateUsuario(this.idEditando, this.formUsuario);
      this.exibirSucesso('Informações do usuário atualizadas no banco de dados!');
    } else {
      this.db.createUsuario(this.formUsuario);
      this.exibirSucesso('Novo usuário cadastrado e salvo no banco JSON!');
    }

    this.abaAtiva = 'gerenciar';
    this.modoEdicao = false;
    this.idEditando = null;
  }

  excluirUsuario(id: string): void {
    if (this.usuarios.length <= 1) {
      this.exibirErro('Não é possível excluir o único usuário do sistema.');
      return;
    }

    if (confirm('Deseja realmente remover este usuário do banco de dados?')) {
      this.db.deleteUsuario(id);
      this.exibirSucesso('Usuário removido com sucesso.');
    }
  }

  // Backup e exportação/importação JSON
  exportarJson(): void {
    const jsonStr = this.db.exportarBancoJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boticario_database_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.exibirSucesso('Arquivo JSON exportado com sucesso!');
  }

  importarJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const conteudo = reader.result as string;
      const sucesso = this.db.importarBancoJson(conteudo);
      if (sucesso) {
        this.exibirSucesso('Banco de dados JSON importado e sincronizado com sucesso!');
      } else {
        this.exibirErro('Erro ao importar JSON. Verifique a estrutura do arquivo.');
      }
    };
    reader.readAsText(file);
  }

  resetarBanco(): void {
    if (confirm('Tem certeza que deseja restaurar o banco de dados para os valores iniciais padrão? Todas as alterações serão redefinidas.')) {
      this.db.resetarBancoParaPadrao();
      this.exibirSucesso('Banco restaurado para os dados padrão com sucesso!');
    }
  }

  private exibirSucesso(msg: string): void {
    this.mensagemSucesso = msg;
    this.mensagemErro = '';
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3500);
  }

  private exibirErro(msg: string): void {
    this.mensagemErro = msg;
    this.mensagemSucesso = '';
    setTimeout(() => {
      this.mensagemErro = '';
    }, 4000);
  }
}
