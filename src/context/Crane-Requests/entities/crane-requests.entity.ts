import { Schema, Document } from 'mongoose';

export interface ICraneRequest extends Document {
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
    ubicacionActualDriver: {
        latitud: number;
        longitud: number;
    };
    total: number;
    fechaInicio: Date;
    fechaFin: Date;
    distancia: string;
    tiempoRutaCliente: string;
    tiempoLlegada: string;
    direccionRecogida: string;
    direccionEntrega: string;
    driverComenzoViaje: Date;
    driverLlegoRecogerVehiculo: Date;
    driverCompletoServicio: Date;
    // tipoVehiculo: string;
    patente: string;
    vehicleClientImageUrl: string;
    evaluationId: Schema.Types.ObjectId;
}

export enum EstadoCraneRequest {
    PENDIENTE = 'PENDIENTE',
    EN_CURSO = 'EN_CURSO',
    EN_LUGAR = 'EN_LUGAR',
    CON_CLIENTE_EN_CAMINO = 'CON_CLIENTE_EN_CAMINO',
    COMPLETADO = 'COMPLETADO',
    CANCELADO = 'CANCELADO',
}


export const CraneRequestSchema = new Schema<ICraneRequest>({
    clienteId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',  // Asumiendo que tienes una colección de clientes
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
        enum: Object.values(EstadoCraneRequest),  // Usa los valores del enum
        default: EstadoCraneRequest.PENDIENTE,
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
    ubicacionActualDriver: {
        latitud: {
            type: Number,
            required: false,
        },
        longitud: {
            type: Number,
            required: false,
        },
    },

    total: {
        type: Number,
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
        required: false,
    },
    tiempoRutaCliente: {
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
    driverComenzoViaje: {
        type: Date,
        default: null,
    },
    driverLlegoRecogerVehiculo: {
        type: Date,
        default: null,
    },
    driverCompletoServicio: {
        type: Date,
        default: null,
    },
    // tipoVehiculo: {
    //     type: String,
    //     required: true,
    // },
    patente: {
        type: String,
        required: true,
    },
    vehicleIncidentPhotosId: {
        type: Schema.Types.ObjectId,  // Asegúrate de que esté definido así
        ref: 'VehicleIncidentPhoto',
    },
    vehicleClientImageUrl: {
        type: String,
        required: true,
    },

    evaluationId: {
        type: Schema.Types.ObjectId,
        ref: 'Evaluation',  // Referencia a la evaluación
      },
});
