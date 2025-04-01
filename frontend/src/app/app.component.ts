import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPaginaComponent } from './componentes/header-pagina/header-pagina.component';
import { MenuLateralComponent } from "./componentes/menu-lateral/menu-lateral.component";
import { HomeComponent } from "./telas/home/home.component";
import { ProdutoListaComponent } from "./telas/produto-lista/produto-lista.component";
import { ProdutoFormComponent } from "./telas/produto-form/produto-form.component";
import { FornecedorListaComponent } from "./telas/fornecedor-lista/fornecedor-lista.component";
import { FornecedorFormComponent } from "./telas/fornecedor-form/fornecedor-form.component";
import { UsuarioListaComponent } from "./telas/usuario-lista/usuario-lista.component";
import { UsuarioFormComponent } from "./telas/usuario-form/usuario-form.component";
import { LoginComponent } from "./telas/login/login.component";
import { Usuario } from './models/models.component';
import { EntradaSaidaListaComponent } from './telas/entradas-saidas-lista/entradas-saidas-lista.component';

interface IPagina {
  [key: string]: string;
};

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderPaginaComponent,
    MenuLateralComponent,
    HomeComponent,
    ProdutoListaComponent,
    FornecedorListaComponent,
    UsuarioListaComponent,
    EntradaSaidaListaComponent,
    ProdutoFormComponent,
    FornecedorFormComponent,
    UsuarioFormComponent,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent {
  titulos: IPagina = {
    'HOME': 'Painel de Controle',
    'PRODUTO-LISTA': 'Lista de Produtos',
    'PRODUTO-FORM': 'Cadastro de Produtos',
    'FORNECEDOR-LISTA': 'Lista de Fornecedores',
    'FORNECEDOR-FORM': 'Cadastro de Fornecedores',
    'USUARIO-LISTA': 'Lista de Usuários',
    'USUARIO-FORM': 'Cadastro de Usuários',
    'LOGIN': 'Acesso Restrito',
    'ENTRADA_SAIDA': 'Entradas e Saídas - Histórico'
  };

  paginaAtual: string = 'LOGIN';
  titulo: string = this.titulos[this.paginaAtual];
  usuarioLogado!: Usuario;

  constructor() {
    this.checkLoggedUser();
  }

  alterarPaginaAtual(pagina: string) {
    this.paginaAtual = pagina;
    this.titulo = this.titulos[pagina];
  }

  checkLoggedUser() {
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      this.usuarioLogado = JSON.parse(currentUser);
      this.paginaAtual = 'HOME';
      this.titulo = this.titulos[this.paginaAtual];
    }
  }
}
