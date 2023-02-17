import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class VerificacionService {

  constructor(private httpClient: HttpClient) { }


  public getVerificacion(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}verification/${id}`, httpOptions);
  }
}
