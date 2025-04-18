import { inject, signal } from "@angular/core";
import { ModalContent, Model } from "../models/models.component";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal-generic/modal-generic.component";

export class Paginacao {
    listaModels = signal<Model[]>([]);
    listaModelsPaginados = signal<Model[]>([]);
    modelSelecionado!: Model;
    paginaAtual: number = 1;
    totalPaginas: number = 1;
    totalPorPagina: number = 0;
    totalRegistros: number = 0;
}

export abstract class BaseTelaListagemComponent {
  protected paginacao: Paginacao;
  protected currentModal!: NgbModalRef;
  protected modalService = inject(NgbModal);

  constructor(totalPorPagina: number = 10) {
    this.paginacao = new Paginacao();
    this.paginacao.totalPorPagina = totalPorPagina;
  }

  protected fatiarListaModels() {
    const startIndex = (this.paginacao.paginaAtual - 1) * this.paginacao.totalPorPagina;
    const endIndex = startIndex + this.paginacao.totalPorPagina;
    this.paginacao.listaModelsPaginados.update(() => this.paginacao.listaModels().slice(startIndex, endIndex));
  }

  protected setupPaginacao() {
    if (this.paginacao.listaModels()) {
      this.paginacao.totalRegistros = this.paginacao.listaModels().length;
      this.paginacao.totalPaginas = Math.ceil(this.paginacao.totalRegistros / this.paginacao.totalPorPagina);
      this.fatiarListaModels();
    }
  }

  protected proximaPagina() {
    if (this.paginacao.paginaAtual < this.paginacao.totalPaginas) {
      this.paginacao.paginaAtual++;
      this.fatiarListaModels();
    }
  }

  protected paginaAnterior() {
    if (this.paginacao.paginaAtual >= 1) {
      this.paginacao.paginaAtual--;
      this.fatiarListaModels();
    }
  }

  protected compare<T>(colunaOrdenar: string, ordem: string) {
    return ( a: T, b: T ) => {
      const valueA: any = a[colunaOrdenar as keyof T];
      const valueB: any = b[colunaOrdenar as keyof T];

      if (ordem === 'ASC') {
        if ( valueA < valueB ){
          return -1;
        }
        if ( valueA > valueB ){
          return 1;
        }
        return 0;
      } else {
        if ( valueA > valueB ){
          return -1;
        }
        if ( valueA < valueB ){
          return 1;
        }
        return 0;
      }
    };
  }

  protected abstract modalAction(action: string): Promise<void>;

  protected openModal(modalContent: ModalContent): void {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }
}
