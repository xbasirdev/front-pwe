import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EgresadoService {

  constructor(private httpClient: HttpClient) { }
  
  public getEgresados(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`http://127.0.0.1:8300/api/egresado`, httpOptions);
  }

  public exportEgresados(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders(),
     };
    return this.httpClient.post(`http://127.0.0.1:8300/api/user/export`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }
  public importEgresados(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`http://127.0.0.1:8300/api/user/import`,parameters, httpOptions);
  }
}