import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GenericResponse, GetProdutoFormatosResponse, GetProdutosResponse, Produto, ProdutoInsert, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getAll(filtro: string): Promise<GetProdutosResponse> {
    return firstValueFrom(this.http.get<GetProdutosResponse>(this.getUrlWithPath('produtos?filtro=' + filtro)));
  }

  async deleteById(id: number): Promise<GenericResponse> {
    return firstValueFrom(this.http.delete<GenericResponse>(this.getUrlWithPath('produto/' + id)));
  }

  async createNew(produto: ProdutoInsert): Promise<ResponseData> {
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('produto'), produto));
  }

  async getFormatos() {
    return firstValueFrom(this.http.get<GetProdutoFormatosResponse>(this.getUrlWithPath('produto/formatos')));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
