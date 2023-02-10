import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';
@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  constructor(private httpClient: HttpClient) { }

  public getCuestionarios(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario`, httpOptions);
  }

  public getCuestionario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}cuestionario/${id}`, httpOptions);
  }

  public getCuestionarioPregunta(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}cuestionarioPregunta/${id}`, httpOptions);
  }

  public getCuestionariosRespuesta(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}cuestionarioRespuesta`, httpOptions);
  }

  public getObjetivoCuestionario(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}objetivoCuestionario`, httpOptions);
  }

  public getEgresado(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}egresado/${id}`, httpOptions);
  }

  public getPreguntaOpciones(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}opcionPregunta`, httpOptions);
  }

  public saveRespuestas(answers): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}cuestionarioRespuesta`, answers, httpOptions);
  }
}
