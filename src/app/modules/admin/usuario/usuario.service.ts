import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient) { }
  
  public getUsuarios(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}user`, httpOptions);
  }  
  
  public getUsuario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}user/${id}`, httpOptions);
  }

  public saveUsuario(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}user/`, parameters, httpOptions);
  }

  public updateUsuario(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}user/${id}`, parameters, httpOptions);
  }

  public deleteUsuario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}user/${id}`, httpOptions);
  }

  public exportUsuarios(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders(),
     };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}user/export`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }
  public importUsuarios(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}user/import`,parameters, httpOptions);
  }
}