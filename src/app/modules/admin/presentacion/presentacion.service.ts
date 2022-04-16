import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {

  constructor(private httpClient: HttpClient) { }
  
  public getPresentaciones(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}presentacionDep/`, httpOptions);
  }

  public getPresentacion(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}presentacionDep/${id}`, httpOptions);
  }

  public savePresentacion(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}presentacionDep/`, parameters, httpOptions);
  }

  public updatePresentacion(id, parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}presentacionDep/${id}`, parameters, httpOptions);
  }

  public deletePresentacion(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}presentacionDep/${id}`, httpOptions);
  }
}