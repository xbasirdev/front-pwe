import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private httpClient: HttpClient) { }

  public getBancos(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}banco/`, httpOptions);
  }

  public getBanco(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}banco/${id}`, httpOptions);
  }

  public getBancoPreguntas(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}bancoPregunta/${id}`, httpOptions);
  }

  public getPreguntaOpciones(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}opcionPregunta`, httpOptions);
  }

  public getTipoPregunta(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}tipoPregunta`, httpOptions);
  }

  public getPreguntas(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}cuestionarioPregunta`, httpOptions);
  }

  public saveBanco(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}banco/`, parameters, httpOptions);
  }

  public updateBanco(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GATEWAY}banco/${id}`, parameters, httpOptions);
  }

  public deleteBanco(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}banco/${id}`, httpOptions);
  }

  public saveBancoPregunta(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}bancoPregunta/`, parameters, httpOptions);
  }

  public deleteBancoPregunta(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GENERAL}bancoPregunta/${id}`, httpOptions);
  }
}
