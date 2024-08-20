import { Schema, Document } from 'mongoose';

export interface IVehicleIncidentPhoto extends Document {
  urlFrontal: string;
  urlTrasera: string;
  urlLateralDerechoCopiloto: string;
  urlLateralIzquierdoConductor: string;
}

export const vehicleIncidentPhotosSchema = new Schema<IVehicleIncidentPhoto>({
  urlFrontal: {
    type: String,
    required: true,
    trim: true,
  },
  urlTrasera: {
    type: String,
    required: true,
    trim: true,
  },
  urlLateralDerechoCopiloto: {
    type: String,
    required: true,
    trim: true,
  },
  urlLateralIzquierdoConductor: {
    type: String,
    required: true,
    trim: true,
  },
});
