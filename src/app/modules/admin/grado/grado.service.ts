import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  constructor(private httpClient: HttpClient) { }
  
  public getGrados(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`http://127.0.0.1:8300/api/actoGrado`, httpOptions);
  }

  public getGrado(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}actoGrado/${id}`, httpOptions);
  }

  public saveGrado(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}actoGrado/`, parameters, httpOptions);
  }

  public updateGrado(id, parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}actoGrado/${id}`, parameters, httpOptions);
  }

  public deleteGrado(id): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}actoGrado/${id}`, httpOptions);
  }
}