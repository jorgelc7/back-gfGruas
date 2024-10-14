import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import axios from 'axios';
@Injectable()
export class MapsService {
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

  private readonly photonUrl = 'https://photon.gfgruas.cl/reverse';

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await axios.get(this.photonUrl, {
        params: {
          lat,
          lon,
          limit: 1,
        },
        headers: {
          'User-Agent': 'MiAppGruas/1.0', // Asegúrate de personalizar el User-Agent
        },
      });

      if (response.data && response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const properties = feature.properties;
    
        // Extraer los campos necesarios
        const name = properties.name || '';
        const street = properties.street || '';
        const district = properties.district || '';
        const city = properties.city || properties.locality || '';
        const state = properties.state || '';
        const country = properties.country || '';
    
        // Construir la dirección legible
        let address = '';
    
        if (street) {
            address = `${street}, ${district}, ${city}`;
        } else if (name) {
            address = `${name}, ${district}, ${city}`;
        } else {
            address = `${district}, ${city}`;
        }
    
        console.log('Dirección obtenida para el usuario:', address);
    
        return address;
      } else {
        return 'Dirección no encontrada';
      }
    } catch (error) {
      console.error('Error en reverseGeocode:', error);
      throw new Error('Error al obtener la dirección');
    }
  }
}
