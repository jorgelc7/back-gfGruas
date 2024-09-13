import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GoogleMapsService {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  async getDirections(origin: string, destination: string) {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY, // Asegúrate de tener configurada tu API Key en el .env
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching directions from Google Maps:', error);
      throw error;
    }
  }

  async getReverseGeocode(lat: string, lng: string) {
    const response = await this.client.reverseGeocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data.results[0]?.formatted_address || 'Address not found';
  }
}
