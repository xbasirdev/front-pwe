import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SingInService {

  constructor(private httpClient: HttpClient) { }

  public getTest(): any { 
    // httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    // return this.httpClient.get<any>(value, httpOptions);
    return this.httpClient.get('http://127.0.0.1:8300/api/product');
  }

  public getTest2(): any { 
    // httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    // return this.httpClient.get<any>(value, httpOptions);
    return this.httpClient.get('http://127.0.0.1:8300/api/entry');
  }
}
