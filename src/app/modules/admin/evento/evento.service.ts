import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private httpClient: HttpClient) { }

  public getEventos(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`http://127.0.0.1:8300/api/evento`, httpOptions);
  }

  public getEvento(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}evento/${id}`, httpOptions);
  }

  public saveEvento(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}evento/`, parameters, httpOptions);
  }

  public updateEvento(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}evento/${id}`, parameters, httpOptions);
  }

  public deleteEvento(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}evento/${id}`, httpOptions);
  }
}
