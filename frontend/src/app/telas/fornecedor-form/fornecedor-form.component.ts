import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule
  ],
  templateUrl: './fornecedor-form.component.html',
  styles: ''
})
export class FornecedorFormComponent {
  fornecedorSelecionado = {};
  @Output() showLoading = new EventEmitter<boolean>();
  @Output() alterarPaginaAtual = new EventEmitter<string>();

  private showLoadingComponent(show: boolean) {
    this.showLoading.emit(show);
  }

}
