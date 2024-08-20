import { Schema, Document } from 'mongoose';

export interface ITowingServices extends Document {
    clienteId: Schema.Types.ObjectId;
    gruaId: Schema.Types.ObjectId;
    driverId: Schema.Types.ObjectId;
    vehicleIncidentPhotosId: Schema.Types.ObjectId;
    estado: string;
    coordenadasInicio: {
        latitud: number;
        longitud: number;
    };
    coordenadasDestino: {
        latitud: number;
        longitud: number;
    };
    total: string;
    fechaInicio: Date;
    fechaFin: Date;
    distancia: string;
    tiempoLlegada: string;
    direccionRecogida: string;
    direccionEntrega: string;

}

export const TowingServicesSchema = new Schema<ITowingServices>({
    clienteId: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',  // Asumiendo que tienes una colección de clientes
        required: true,
    },
    gruaId: {
        type: Schema.Types.ObjectId,
        ref: 'grua',  // Refiriendo a la colección Gruas
        required: false,
    },
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',  // Asumiendo que tienes una colección de drivers
        required: false,
    },
    estado: {
        type: String,
        required: true,
        enum: ['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'],
        default: 'PENDIENTE',
    },
    coordenadasInicio: {
        latitud: {
            type: Number,
            required: true,
        },
        longitud: {
            type: Number,
            required: true,
        },
    },
    coordenadasDestino: {
        latitud: {
            type: Number,
            required: true,
        },
        longitud: {
            type: Number,
            required: true,
        },
    },
    total: {
        type: String,
        required: true,
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now,
    },
    fechaFin: {
        type: Date,
    },
    distancia: {
        type: String,
        required: true,
    },
    tiempoLlegada: {
        type: String,
        required: true,
    },
    direccionRecogida: {
        type: String,
        required: true,
    },
    direccionEntrega: {
        type: String,
        required: true,
    },
    vehicleIncidentPhotosId: {
        type: Schema.Types.ObjectId,  // Asegúrate de que esté definido así
        ref: 'VehicleIncidentPhoto',
    },
});
