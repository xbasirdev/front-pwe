export class Cuestionario {
    id: number;
    nombre: string;
    user_id?: number;
    privacidad: string;
    descripcion: string;
    tipo: string;
    objetivo: number[];
    fecha_inicio?: any;
    fecha_fin?: any;
}