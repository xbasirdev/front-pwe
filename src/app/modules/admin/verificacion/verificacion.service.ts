import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class VerificacionService {

  constructor(private httpClient: HttpClient) { }
  
  public getVerificacions(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario`, httpOptions);
  }

  public getVerificacion(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario/${id}`, httpOptions);
  }

  public getVerificacionCarreras(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}objetivoCuestionario/${id}`, httpOptions);
  }

  public saveVerificacions(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}cuestionario`, parameters, httpOptions);
  }

  public updateCuestionario(id, parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}cuestionario/${id}`, parameters, httpOptions);
  }

  public deleteCuestionario(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}cuestionario/${id}`, httpOptions);
  }
}