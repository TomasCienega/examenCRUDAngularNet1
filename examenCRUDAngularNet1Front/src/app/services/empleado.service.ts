import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment'; 
import { Empleado, Departamento } from '../interfaces/res-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private urlApi: string = environment.endpoint; // "https://localhost:7091/api/"

  // Ajustado a: api/Empleado/ListaEmpleados?idDep=0
  lista(idDep: number = 0): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.urlApi}Empleado/ListaEmpleados?idDep=${idDep}`);
  }

  // Ajustado a: api/Departamento/ListarDepartamentos
  listaDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.urlApi}Departamento/ListarDepartamentos`);
  }

  // Ajustado a: api/Empleado/GuardarEmleado (Ojo: escribiste "Emleado" en el Back, hay que respetarlo)
  guardar(modelo: any): Observable<any> {
    return this.http.post(`${this.urlApi}Empleado/GuardarEmleado`, modelo);
  }
  // Cambiar el bit de activo/inactivo (Ajustado a: api/Empleado/EstadoEmpleado?idEmp=X)
// Nota: En tu Back usaste [HttpPut] para este método
cambiarEstado(idEmp: number): Observable<any> {
  return this.http.put(`${this.urlApi}Empleado/EstadoEmpleado?idEmp=${idEmp}`, {});
}

// Eliminar (Ajustado a: api/Empleado/EliminarEmpleado/X)
eliminar(idEmp: number): Observable<any> {
  return this.http.delete(`${this.urlApi}Empleado/EliminarEmpleado/${idEmp}`);
}
// En empleado.service.ts
editar(modelo: any): Observable<any> {
  // Asegúrate de que el objeto 'modelo' lleve idEmpleado, nombreEmpleado e idDepartamento
  return this.http.put(`${this.urlApi}Empleado/EditarEmpleado`, modelo);
}
}