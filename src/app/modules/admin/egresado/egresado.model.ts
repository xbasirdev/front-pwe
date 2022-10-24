export class Egresado {
    nombres: string;
    apellidos: string;
    cedula: string;
    correo: string;
    telefono?: string;
    egresado?:{
        fecha_egreso?: string,
        modo_registro: string,
        notificacion: boolean,
        periodo_egreso: string,
        correo: string,
        carrera ?: { 
            nombre: string,
            estado: string,
        }
    }
}



