import * as moment from 'moment';
import { Notification } from 'app/layout/common/notifications/notifications.types';

/* tslint:disable:max-line-length */
export const notifications: Notification[] = [
    {
        id         : '493190c9-5b61-4912-afe5-78c21f1044d7',
        icon       : 'heroicons_outline:academic-cap',
        title      : 'Nuevo Acto de grado pautado',
        description: 'Pautado para el 20/10/2022',
        time       : moment().subtract(25, 'minutes').toISOString(), // 25 minutes ago
        read       : false
    },
    {
        id         : '6e3e97e5-effc-4fb7-b730-52a151f0b641',
        icon      : 'heroicons_outline:academic-cap',
        description: 'Nuevo Trabajo disponible en tu carrera',
        time       : moment().subtract(50, 'minutes').toISOString(), // 50 minutes ago
        read       : true,
        link       : '/dashboards/project',
        useRouter  : true
    }
];
