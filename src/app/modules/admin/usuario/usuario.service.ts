import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient) { }
  
  public getUsuarios(): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`http://127.0.0.1:8300/api/egresado`, httpOptions);
  }  
  public exportUsuarios(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders(),
     };
    return this.httpClient.post(`http://127.0.0.1:8300/api/user/export`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }
  public importUsuarios(parameters): any { 
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`http://127.0.0.1:8300/api/user/import`,parameters, httpOptions);
  }
}