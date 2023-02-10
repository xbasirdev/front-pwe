import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';
@Injectable({
  providedIn: 'root'
})
export class TrabajoService {

  constructor(private httpClient: HttpClient) { }

  public getTrabajos(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}bolsaTrabajo`, httpOptions);
  }

  public getTrabajo(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}bolsaTrabajo/${id}`, httpOptions);
  }

  public saveTrabajo(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}bolsaTrabajo/`, parameters, httpOptions);
  }

  public updateTrabajo(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}bolsaTrabajo/${id}`, parameters, httpOptions);
  }

  public deleteTrabajo(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}bolsaTrabajo/${id}`, httpOptions);
  }

  public getTrabajoEgresadoAll(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}bolsaEgresado`, httpOptions);
  }

  public getEgresadoAll(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}egresado`, httpOptions);
  }

  public saveAplicacion(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}bolsaEgresado/`, parameters, httpOptions);
  }
}
