import { ModalContent, NavegacaoApp, Produto } from '../../models/models.component';
import { Component, EventEmitter, inject, Output,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from "ng2-currency-mask";
import { EstoqueService } from '../../services/estoque.service';

export const CustomNumberMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: "",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: "."
};

@Component({
  selector: 'app-entrada-saida-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  providers: [
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomNumberMaskConfig }
  ],
  templateUrl: './entrada-saida-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './entrada-saida-form.component.css'
  ]
})
export class EntradaSaidaFormComponent {

  protected errorMessage: string = '';
  protected isLoadingVisible: boolean = false;
  protected produtoSelecionado: Produto = {id:0, formatoNome:'', estoqueTotal:0, estoqueCursos:0, estoqueClientes:0, validade:new Date(), fornecedores:[], vencendo: 0, vencidos: 0 };
  protected totalCalculado: number = 0;
  private isCadastroFinished = false;
  private currentModal!: NgbModalRef;
  private modalService = inject(NgbModal);
  private produtoService: ProdutoService = inject(ProdutoService);
  private estoqueService: EstoqueService = inject(EstoqueService);
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;
  @Input({ required: true }) itemModo!: number;

  protected entradaSaidaForm = new FormGroup({
    produtoNome: new FormControl(''),
    isValidadeDefinida: new FormControl<boolean>(false),
    validade: new FormControl<string>(''),
    totalLote: new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(50000)]),
    totalCursos: new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(50000)]),
    totalClientes: new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(50000)]),
  });

  constructor() {
  }

  async ngOnChanges() {
    if (this.itemId > 0) {
      this.prepararProdutoParaCadastrarEntradaSaida();
    } else {
      this.errorMessage = 'Nenhum produto selecionado!';
    }
  }

  async prepararProdutoParaCadastrarEntradaSaida() {
    this.showLoadingComponent(true);
    try {
      console.log(this.itemId);
      const produtoResponse: Produto = await this.produtoService.getById(this.itemId);

      if (produtoResponse) {
        this.showLoadingComponent(false);
        this.produtoSelecionado = produtoResponse;

        this.entradaSaidaForm.setValue({
          produtoNome: this.produtoSelecionado.nome!,
          isValidadeDefinida: this.produtoSelecionado.isValidadeDefinida!,
          validade: '',
          totalLote: 0,
          totalCursos: 0,
          totalClientes: 0
        });
        this.entradaSaidaForm.controls.produtoNome.disable();
        this.entradaSaidaForm.controls.isValidadeDefinida.disable();

        if (this.produtoSelecionado.isValidadeDefinida) {
          this.entradaSaidaForm.controls.validade.addValidators(Validators.required);
        }

        if(this.itemModo != 1) { // se é saída, não pode ultrapassar o atual
          this.entradaSaidaForm.controls.totalLote.addValidators(Validators.max(this.produtoSelecionado.estoqueTotal));
        }
        this.calcular();
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
      if (error && error.statud == 404) {
        this.isCadastroFinished = true;
        this.openModal({
          title: 'AVISO',
          message: 'Produto indispon&iacute;vel!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    }
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async onSubmitForm() {
    const totalCursos = Number(this.entradaSaidaForm.controls.totalCursos.value);
    const totalClientes = Number(this.entradaSaidaForm.controls.totalClientes.value);
    const totalLote = Number(this.entradaSaidaForm.controls.totalLote.value);
    const isValidadeDefinida: boolean | undefined = this.produtoSelecionado.isValidadeDefinida;
    const vencimento: string | null = isValidadeDefinida ? this.entradaSaidaForm.controls.validade.value : '';
    const isDistributed = totalCursos + totalClientes == totalLote;
    const restante = totalLote - totalCursos - totalClientes;
    const totalSoma = totalClientes + totalCursos;
    const dica = restante >= 0 ? `Distribua <b>${restante}</b> para cursos e/ou clientes` : `Remova <b>${restante*-1}</b> de cursos e/ou clientes`;
    const isEntrada = this.itemModo == 1;

    if (totalCursos == 0 && totalClientes == 0) {
      this.openModal({
        title: 'AVISO',
        message: 'Você precisa definir a quantidade para <b>Clientes</b> e <b>Cursos</b>.',
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
      return;
    }

    if (!isDistributed) {
      this.openModal({
        title: 'AVISO',
        message: `Você precisa distribuir a quantidade para <b>Clientes</b> e <b>Cursos</b> conforme o total de ${this.itemModo != 1 ? 'saída' : 'entrada'}. <p>Total: <b>${totalLote}</b><br/>Atribuído: <b>${totalSoma}</b><br/>Dica: ${dica}</p>`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
      return;
    }

    if (!this.entradaSaidaForm.valid && isEntrada && isValidadeDefinida && vencimento === '') {
      this.openModal({
        title: 'AVISO',
        message: `Você precisa definir a data de validade`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
      return;
    }

    this.showLoadingComponent(true);
    try {
      await this.estoqueService.save({
        produtoId: this.produtoSelecionado.id,
        tipo: this.itemModo,
        total: totalLote,
        validade: isEntrada && isValidadeDefinida && vencimento ? vencimento : undefined,
        qtdClientes: totalClientes,
        qtdCursos: totalCursos,
        tipoNome: ''
      });

      this.isCadastroFinished = true;
      this.openModal({
        title: 'SUCESSO',
        message: `${this.itemModo != 1 ? 'Saída' : 'Entrada'} de estoque registrada com sucesso!`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
      if (error && error.statud == 404) {
        this.isCadastroFinished = true;
        this.openModal({
          title: 'AVISO',
          message: 'Produto indispon&iacute;vel!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    } finally {
      this.showLoadingComponent(false);
    }
  }

  async modalAction(action: string) {
    this.currentModal.close();

    if (this.isCadastroFinished && action === 'close') {
      this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-LISTA', itemId: 0, itemNome: '' });
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-LISTA', itemId: 0, itemNome: '' });
    }
  }

  openModal(modalContent: ModalContent) {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }

  confirmarCancelar() {
    this.openModal({
      title: 'AVISO',
      message: `Deseja realmente <b>descartar</b> este registro de estoque?`,
      cancelButtonText: 'Não',
      cancelButtonClass: 'btn-primary',
      buttons: [
        {
          text: 'Sim',
          action: 'confirm-cancel',
          cssClass: 'btn-danger'
        }
      ]
    });
  }

  private getModalAvisoContent(mensagem: string) {
    return {
      title: 'AVISO',
      message: mensagem,
      cancelButtonText: 'OK',
      cancelButtonClass: 'btn-success'
    };
  }

  calcular(tipo?: string) {
    if (this.itemModo != 1
      && Number(this.entradaSaidaForm.controls.totalLote.value) > this.produtoSelecionado.estoqueTotal) {
      this.openModal(this.getModalAvisoContent('O valor <b>Total de Saída</b> não deve ser maior que o estoque atual.'));
      this.entradaSaidaForm.controls.totalLote.setValue(this.produtoSelecionado.estoqueTotal);
    }

    if (this.itemModo != 1) {
      this.totalCalculado = this.produtoSelecionado.estoqueTotal - Number(this.entradaSaidaForm.controls.totalLote.value);
      const totalCalculadoClientes = this.produtoSelecionado.estoqueClientes - Number(this.entradaSaidaForm.controls.totalClientes.value);
      const totalCalculadoCursos = this.produtoSelecionado.estoqueCursos - Number(this.entradaSaidaForm.controls.totalCursos.value);

      if (tipo === 'cursos' && totalCalculadoCursos < 0) {
        this.openModal(this.getModalAvisoContent(`A quantidade de saída para cursos não deve maior que ${this.produtoSelecionado.estoqueCursos}.`));
        this.entradaSaidaForm.controls.totalCursos.setValue(this.produtoSelecionado.estoqueCursos);
      }

      if (tipo === 'clientes' && totalCalculadoClientes < 0) {
        this.openModal(this.getModalAvisoContent(`A quantidade de saída para clientes não deve maior que ${this.produtoSelecionado.estoqueClientes}.`));
        this.entradaSaidaForm.controls.totalClientes.setValue(this.produtoSelecionado.estoqueClientes);
      }
    } else {
      this.totalCalculado = this.produtoSelecionado.estoqueTotal + Number(this.entradaSaidaForm.controls.totalLote.value);
    }
  }
}
