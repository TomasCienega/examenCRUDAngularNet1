import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment'; 
import { Login, Sesion } from '../interfaces/res-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private urlApi: string = environment.endpoint + "Usuario/";

  login(request: Login): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.urlApi}Login`, request);
  }
}