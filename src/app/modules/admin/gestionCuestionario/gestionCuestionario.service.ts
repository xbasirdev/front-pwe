import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../../core/settings/constants';

@Injectable({
  providedIn: 'root'
})
export class GestionCuestionarioService {

  constructor(private httpClient: HttpClient) { }

  public getGestionCuestionarios(): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario`, httpOptions);
  }

  public getGestionCuestionario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}cuestionario/${id}`, httpOptions);
  }

  public getGestionCuestionarioCarreras(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GATEWAY}objetivoCuestionario/${id}`, httpOptions);
  }

  public saveGestionCuestionarios(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}cuestionario`, parameters, httpOptions);
  }

  public updateCuestionario(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.patch(`${AppSettings.API_GENERAL}cuestionario/${id}`, parameters, httpOptions);
  }

  public deleteCuestionario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GATEWAY}cuestionario/${id}`, httpOptions);
  }


  public getPreguntasCuestionario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_GENERAL}cuestionarioPregunta/${id}`, httpOptions);
  }

  public saveCuestionarioPregunta(parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.post(`${AppSettings.API_GENERAL}cuestionarioPregunta/`, parameters, httpOptions);
  }

  public deleteCuestionarioPregunta(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.delete(`${AppSettings.API_GENERAL}cuestionarioPregunta/${id}`, httpOptions);
  }

  public exportR(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({}),
     };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}cuestionario/export-r/${id}`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }

  public exportD(id, parameters): any {
    const httpOptions = {
      headers: new HttpHeaders({}),
     };
    return this.httpClient.post(`${AppSettings.API_GATEWAY}cuestionario/export-d/${id}`, parameters, {responseType:'arraybuffer', observe: 'response'});
  }

  public getRespuestasCuestionario(id): any {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.httpClient.get(`${AppSettings.API_ESTADISTICAS}respuestas`, httpOptions);
  }

}
