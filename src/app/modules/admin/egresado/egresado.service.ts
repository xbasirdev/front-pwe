import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class EgresadoService {

  constructor(private httpClient: HttpClient) { }
  
  public getEgresados(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}egresado`, httpOptions);
  }

  public getEgresado(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}egresado/${id}`, httpOptions);
  }

  public saveEgresado(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}egresado/`, parameters, httpOptions);
  }

  public updateEgresado(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}egresado/${id}`, parameters, httpOptions);
  }

  public deleteEgresado(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}egresado/${id}`, httpOptions);
  }


  public exportEgresados(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({}),
     };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}user/export`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }

  public importEgresados(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}user/import`,parameters, httpOptions);
  }

  public updateNotificationStatus(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}egresado/change-notification-status`,parameters, httpOptions);
  }
}