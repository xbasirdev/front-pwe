export interface User
{
    nombres: string;
    apellidos: string;
    cedula: string;
    correo: string;
    role:string;
    telefono?: string;
    egresado?:{
        fecha_egreso?: string,
        modo_registro: string,
        notificacion: boolean,
        periodo_egreso: string,
        correo: string,
        carrera_id?:string
    }
}
