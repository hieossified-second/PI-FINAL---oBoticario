import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FinanceiroComponent } from './pages/financeiro/financeiro.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { VendasComponent } from './pages/vendas/vendas.component';
import { Inicio } from './clientelas/inicio/inicio';
import { Produtos } from './clientelas/produtos/produtos';
import { MeusPedidos } from './clientelas/meus-pedidos/meus-pedidos';
import { Suporte } from './clientelas/suporte/suporte';
import { Loja } from './clientelas/loja/loja';

export const routes: Routes = [
  // 1. Início principal (Loja / Cliente)
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },

  // Demais rotas da Loja (Cliente)
  { path: 'produtos', component: Produtos },
  { path: 'meus-pedidos', component: MeusPedidos },
  { path: 'suporte', component: Suporte },
  { path: 'loja', component: Loja },

  // Login
  { path: 'login', component: LoginComponent },

  // 2. Início do Admin (Painel Administrativo)
  { path: 'inicio-adm', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'financeiro', component: FinanceiroComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'vendas', component: VendasComponent },

  // Rota coringa (sempre por último)
  { path: '**', redirectTo: '' }
];