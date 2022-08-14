import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  constructor(private httpClient: HttpClient) { }

  public getExtensiones(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`http://127.0.0.1:8300/api/actividadExtension`, httpOptions);
  }

  public getExtension(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}actividadExtension/${id}`, httpOptions);
  }

  public saveExtension(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}actividadExtension/`, parameters, httpOptions);
  }

  public updateExtension(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}actividadExtension/${id}`, parameters, httpOptions);
  }

  public deleteExtension(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}actividadExtension/${id}`, httpOptions);
  }
}
