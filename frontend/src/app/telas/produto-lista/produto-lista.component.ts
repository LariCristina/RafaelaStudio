import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/models.component';

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './produto-lista.component.html',
  styles: ''
})
export class ProdutoListaComponent extends BaseTelaListagemComponent {
  produtoFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private produtoService: ProdutoService) {
    super();
    this.obterProdutos();
  }

  private showLoadingComponent(show: boolean) {
    console.log('enviando para o pai: ' + show);
    this.showLoading.emit(show);
  }


  obterProdutos() {
    this.showLoadingComponent(true);

    this.produtoService.getAll('')
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getProdutosResponse) => {
      if (getProdutosResponse) {
        this.paginacao.listaModels = getProdutosResponse.produtos;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    });
  }

  atualizarProduto(id: number) {

    this.showLoadingComponent(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela produto-form com o id ' + id);
  }

  deletarProduto(id: number) {

    this.showLoadingComponent(true);

    this.produtoService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterProdutos();
      this.showLoadingComponent(false);
    });
  }

  getListaProdutos() : Produto[] {
    return <Produto[]> this.paginacao.listaModelsPaginados;
  }
}
