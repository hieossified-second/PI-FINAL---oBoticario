import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { UsuarioModalComponent } from '../../components/usuario-modal/usuario-modal.component';
import { DatabaseService } from '../../services/database.service';
import { TransacaoFinanceira } from '../../models/financeiro.model';
import { Usuario } from '../../models/usuario.model';

interface ColunaGrafico {
  label: string;
  altura: number;
  valor: number;
}

interface CategoriaDespesa {
  nome: string;
  percentual: number;
  classe: string;
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, UsuarioModalComponent],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css'
})
export class FinanceiroComponent implements OnInit {
  usuarioAtual!: Usuario;
  modalUsuarioAberto = false;

  transacoes: TransacaoFinanceira[] = [];
  movimentacoesFiltradas: TransacaoFinanceira[] = [];
  termoBusca: string = '';

  receitaTotal: number = 0;
  despesasTotal: number = 0;
  lucroLiquido: number = 0;
  porReceita: number = 15;
  porDespesas: number = 8;
  porLucro: number = 18;

  mesSelecionado: string = 'Todos os períodos';
  listaMeses: string[] = [
    'Todos os períodos',
    'Outubro de 2024',
    'Novembro de 2024',
    'Dezembro de 2024',
    'Janeiro de 2026',
    'Fevereiro de 2026',
    'Março de 2026',
    'Abril de 2026',
    'Maio de 2026',
    'Junho de 2026',
    'Julho de 2026',
    'Agosto de 2026',
    'Setembro de 2026',
    'Outubro de 2026',
    'Novembro de 2026',
    'Dezembro de 2026'
  ];

  barrasGrafico: ColunaGrafico[] = [];
  escalasGrafico: string[] = ['R$ 4.000', 'R$ 3.000', 'R$ 2.000', 'R$ 1.000', 'R$ 0'];
  despesasCategorias: CategoriaDespesa[] = [];
  gradienteConico: string = '';

  // Modal de Transação
  modalAberto: boolean = false;
  formTransacao: Omit<TransacaoFinanceira, 'id'> = {
    data: '',
    descricao: '',
    categoria: 'Vendas',
    valor: 0,
    tipo: 'Receita'
  };

  constructor(public db: DatabaseService) {}

  ngOnInit(): void {
    this.db.usuarioAtual$.subscribe(usr => {
      this.usuarioAtual = usr;
    });

    this.db.financeiro$.subscribe(lista => {
      this.transacoes = lista;
      this.recalcularTotais();
      this.filtrarMovimentacoes();
      this.gerarGraficoBarras();
      this.gerarDespesasCategorias();
    });
  }

  recalcularTotais(): void {
    const resumo = this.db.obterResumoFinanceiro();
    this.receitaTotal = resumo.receitaTotal;
    this.despesasTotal = resumo.despesasTotal;
    this.lucroLiquido = resumo.lucroLiquido;
  }

  filtrarMovimentacoes(): void {
    let resultado = [...this.transacoes];

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      resultado = resultado.filter(t =>
        t.descricao.toLowerCase().includes(termo) ||
        t.categoria.toLowerCase().includes(termo) ||
        t.data.includes(termo) ||
        t.tipo.toLowerCase().includes(termo)
      );
    }

    if (this.mesSelecionado !== 'Todos os períodos') {
      const mesMapa: { [nome: string]: string } = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04',
        'Maio': '05', 'Junho': '06', 'Julho': '07', 'Agosto': '08',
        'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
      };
      const partes = this.mesSelecionado.split(' de ');
      const mesNum = mesMapa[partes[0].trim()];
      const anoNum = partes[1]?.trim();

      if (mesNum) {
        resultado = resultado.filter(t => {
          return t.data.includes(`/${mesNum}/`) || (anoNum && t.data.includes(anoNum));
        });
      }
    }

    this.movimentacoesFiltradas = resultado;
  }

  gerarGraficoBarras(): void {
    const receitas = this.transacoes.filter(t => t.tipo === 'Receita');
    const mapaDias: { [data: string]: number } = {};

    receitas.forEach(r => {
      const diaFormatado = r.data.substring(0, 5); // Ex: '16/10'
      mapaDias[diaFormatado] = (mapaDias[diaFormatado] || 0) + r.valor;
    });

    // Gera os últimos 7 dias dinâmicos
    const hoje = new Date();
    const diasAmostra: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoje.getDate() - i);
      const diaStr = String(d.getDate()).padStart(2, '0');
      const mesStr = String(d.getMonth() + 1).padStart(2, '0');
      diasAmostra.push(`${diaStr}/${mesStr}`);
    }

    // Se as datas das transações forem de amostras passadas, inclui dias com receita
    const diasComReceita = Object.keys(mapaDias);
    diasComReceita.forEach(dia => {
      if (!diasAmostra.includes(dia) && diasAmostra.length < 10) {
        diasAmostra.push(dia);
      }
    });

    const valoresReceita = Object.values(mapaDias);
    const maiorReceita = valoresReceita.length > 0 ? Math.max(...valoresReceita, 1000) : 4000;
    const teto = Math.ceil(maiorReceita / 1000) * 1000;

    this.escalasGrafico = [
      this.formatarMoeda(teto),
      this.formatarMoeda(teto * 0.75),
      this.formatarMoeda(teto * 0.5),
      this.formatarMoeda(teto * 0.25),
      this.formatarMoeda(0)
    ];

    this.barrasGrafico = diasAmostra.slice(-7).map(dia => {
      const valor = mapaDias[dia] || 0;
      const altura = teto > 0 ? Math.min(100, Math.round((valor / teto) * 100)) : 10;
      return {
        label: dia,
        altura: Math.max(10, altura),
        valor
      };
    });
  }

  gerarDespesasCategorias(): void {
    const despesas = this.transacoes.filter(t => t.tipo === 'Despesa');
    const totalDesp = despesas.reduce((acc, d) => acc + d.valor, 0);

    if (totalDesp === 0) {
      this.despesasCategorias = [
        { nome: 'Fornecedores', percentual: 45, classe: 'fornecedores' },
        { nome: 'Marketing', percentual: 20, classe: 'marketing' },
        { nome: 'Salários', percentual: 15, classe: 'salarios' },
        { nome: 'Outros', percentual: 20, classe: 'outros' }
      ];
      this.gradienteConico = 'conic-gradient(#1f5c46 0% 45%, #3e9b72 45% 65%, #8cc9a8 65% 80%, #c9e4d3 80% 100%)';
      return;
    }

    const mapaCat: { [cat: string]: number } = {};
    despesas.forEach(d => {
      mapaCat[d.categoria] = (mapaCat[d.categoria] || 0) + d.valor;
    });

    const mapaClasses: { [key: string]: string } = {
      'Fornecedores': 'fornecedores',
      'Marketing': 'marketing',
      'Salários': 'salarios',
      'Contas fixas': 'outros',
      'Outros': 'outros'
    };

    const cores: { [key: string]: string } = {
      'fornecedores': '#1f5c46',
      'marketing': '#3e9b72',
      'salarios': '#8cc9a8',
      'outros': '#c9e4d3'
    };

    this.despesasCategorias = Object.keys(mapaCat).map(cat => ({
      nome: cat,
      percentual: Math.round((mapaCat[cat] / totalDesp) * 100),
      classe: mapaClasses[cat] || 'outros'
    }));

    // Gera gradiente cônico dinâmico
    let acumulado = 0;
    const fatias: string[] = [];
    this.despesasCategorias.forEach((cat, idx) => {
      const cor = cores[cat.classe] || '#3e9b72';
      const inicio = acumulado;
      const fim = idx === this.despesasCategorias.length - 1 ? 100 : acumulado + cat.percentual;
      acumulado = fim;
      fatias.push(`${cor} ${inicio}% ${fim}%`);
    });

    this.gradienteConico = `conic-gradient(${fatias.join(', ')})`;
  }

  abrirModalNovo(): void {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    this.formTransacao = {
      data: `${dia}/${mes}/${ano}`,
      descricao: '',
      categoria: 'Vendas',
      valor: 0,
      tipo: 'Receita'
    };
    this.modalAberto = true;
  }

  salvarTransacao(): void {
    if (!this.formTransacao.descricao.trim()) {
      alert('Informe a descrição da movimentação.');
      return;
    }

    if (this.formTransacao.valor <= 0) {
      alert('Informe um valor numérico positivo.');
      return;
    }

    this.db.createTransacao(this.formTransacao);
    this.fecharModal();
  }

  excluirTransacao(id: string): void {
    if (confirm('Deseja realmente remover esta movimentação financeira?')) {
      this.db.deleteTransacao(id);
    }
  }

  fecharModal(): void {
    this.modalAberto = false;
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
