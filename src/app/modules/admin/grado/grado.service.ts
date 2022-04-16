import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

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
}