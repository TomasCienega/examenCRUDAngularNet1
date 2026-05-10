export interface Login {
    correo: string;
    clave: string;
}

export interface Sesion {
    token: string;
}
export interface Departamento {
    idDepartamento: number;     // minúsculas
    nombreDepartamento: string;
}

export interface Empleado {
    idEmpleado: number;
    nombreEmpleado: string;
    idDepartamento: number;
    nombreDepartamento?: string;
    activo: boolean;
}