import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuLoja } from '../../components/menu-loja/menu-loja';
import { LojaService } from '../../services/loja.service';

interface PerguntaFaq {
  categoria: string;
  pergunta: string;
  resposta: string;
}

@Component({
  selector: 'app-suporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MenuLoja],
  templateUrl: './suporte.html',
  styleUrl: './suporte.css'
})
export class Suporte implements OnInit {
  usuario = 'Visitante';
  totalCarrinho = 0;
  termoBusca = '';
  categoriaAtiva = 'Todas';

  // Campos do formulário de contato
  nomeContato = '';
  emailContato = '';
  assuntoContato = 'Dúvida sobre pedido';
  numeroPedido = '';
  mensagemContato = '';
  protocoloGerado = '';

  perguntas: PerguntaFaq[] = [
    {
      categoria: 'Entregas',
      pergunta: 'Como faço para acompanhar meu pedido?',
      resposta: 'Acesse “Meus pedidos” no menu lateral para consultar o status e o andamento da entrega.'
    },
    {
      categoria: 'Entregas',
      pergunta: 'Qual o prazo de entrega?',
      resposta: 'O prazo varia de acordo com o CEP e aparece antes da confirmação da compra.'
    },
    {
      categoria: 'Trocas',
      pergunta: 'Posso trocar um produto?',
      resposta: 'Sim. Consulte as condições de troca e devolução no prazo de até 30 dias após o recebimento.'
    },
    {
      categoria: 'Pagamentos',
      pergunta: 'Quais são as formas de pagamento?',
      resposta: 'Você pode pagar com cartão de crédito em até 6x sem juros, Pix e boleto.'
    },
    {
      categoria: 'Pagamentos',
      pergunta: 'Como usar um cupom de desconto?',
      resposta: 'Informe o código do cupom (ex: BOTI10) no campo indicado na tela do Carrinho.'
    },
    {
      categoria: 'Conta',
      pergunta: 'Os produtos possuem selo Cruelty Free e Vegano?',
      resposta: 'Sim! O Boticário não realiza testes em animais e possui diversas linhas 100% veganas e com refil.'
    }
  ];

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.usuario = this.lojaService.obterUsuarioLogado();
    if (this.usuario && this.usuario !== 'Visitante') {
      this.nomeContato = this.usuario;
    }

    this.lojaService.carrinho$.subscribe(itens => {
      this.totalCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0);
    });
  }

  get perguntasFiltradas(): PerguntaFaq[] {
    const termo = this.termoBusca.toLowerCase().trim();
    return this.perguntas.filter(item => {
      const bateCategoria =
        this.categoriaAtiva === 'Todas' || item.categoria === this.categoriaAtiva;
      const bateBusca =
        !termo ||
        item.pergunta.toLowerCase().includes(termo) ||
        item.resposta.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }

  selecionarTopico(categoria: string, assuntoPadrao: string): void {
    this.categoriaAtiva = categoria;
    this.assuntoContato = assuntoPadrao;
  }

  enviarMensagem(): void {
    if (!this.nomeContato.trim() || !this.emailContato.trim() || !this.mensagemContato.trim()) {
      alert('Por favor, preencha seu nome, e-mail e a mensagem antes de enviar.');
      return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    this.protocoloGerado = `#SUP-${codigo}`;
    this.mensagemContato = '';
    this.numeroPedido = '';
  }
}