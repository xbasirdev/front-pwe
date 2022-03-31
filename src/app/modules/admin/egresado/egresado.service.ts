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
}