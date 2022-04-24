import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class GestionCuestionarioService {

  constructor(private httpClient: HttpClient) { }
  
  public getGestionCuestionarios(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario`, httpOptions);
  }

  public getGestionCuestionario(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario/${id}`, httpOptions);
  }

  public saveGestionCuestionarios(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}cuestionario`, parameters, httpOptions);
  }
}