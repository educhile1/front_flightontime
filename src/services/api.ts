
import axios from 'axios';

// Interfaz para la solicitud de predicción de vuelo
// Define los datos requeridos por el endpoint de predicción
export interface FlightPredictionRequest {
    flightNumber: string; // Número de vuelo (ej: AM123)
    airline: number;      // ID de la aerolínea
    origin: number;       // ID del aeropuerto de origen
    destination: number;  // ID del aeropuerto de destino
    departureTime: string;// Fecha y hora de salida en formato ISO
}

// Interfaz para la respuesta recibida del servidor de predicción
export interface FlightPredictionResponse {
    id: string | null;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    delayProbability: number; // Probabilidad de retraso (0.0 a 1.0)
}

// Interfaz para los datos procesados que utilizará el frontend
export interface FlightData {
    airline: number;
    onTimePercentage: number;    // Porcentaje de probabilidad de salir a tiempo
    delayPercentage: number;     // Porcentaje de probabilidad de retraso
    averageDelayMinutes: number; // Tiempo estimado de retraso en minutos
}

/**
 * Función para obtener la predicción de vuelo desde el backend.
 * Realiza una petición POST al endpoint /api/v1/predict.
 * 
 * @param flightNumber Número de vuelo
 * @param airline Aerolínea
 * @param origin Aeropuerto de origen
 * @param destination Aeropuerto de destino
 * @param departureTime Fecha y hora de salida
 * @returns Promesa con los datos procesados del vuelo (FlightData)
 */
export const fetchFlightPrediction = async (
    flightNumber: string,
    airline: number,
    origin: number,
    destination: number,
    departureTime: string
): Promise<FlightData> => {
    try {
        const requestData: FlightPredictionRequest = {
            flightNumber,
            airline,
            origin,
            destination,
            departureTime,
        };

        console.log('API Request (Predicción de Vuelo):', requestData);

        // Llamada al servicio backend
        const response = await axios.post<FlightPredictionResponse>(
            'http://localhost:8080/api/v1/predict',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('API Response (Predicción de Vuelo):', response.data);

        const { delayProbability } = response.data;

        // Convertir la probabilidad (0-1) a porcentajes (0-100)
        const delayPercentage = Math.round(delayProbability * 100);
        const onTimePercentage = 100 - delayPercentage;

        // Estimación simulada del tiempo de retraso basada en la probabilidad
        // Nota: En un escenario real, esto debería venir del backend si es posible.
        const averageDelayMinutes = Math.round(delayProbability * 60);

        return {
            airline,
            onTimePercentage,
            delayPercentage,
            averageDelayMinutes,
        };
    } catch (error) {
        console.error('Error fetching flight prediction:', error);
        throw error;
    }
};






// Interfaz para la aerolínea
export interface Airline {
    id: number;
    shortName: string;
    fullName: string;
    active: boolean;
}

// Interfaz para la solicitud de aerolíneas
export interface AirlineRequest {
    active: string;
}

/**
 * Función para obtener la lista de aerolíneas desde el backend.
 * Realiza una petición POST al endpoint /api/v1/get-airline.
 * 
 * @returns Promesa con la lista de aerolíneas (Airline[])
 */
export const getAirlines = async (): Promise<Airline[]> => {
    try {
        const requestData: AirlineRequest = {
            active: "true"
        };

        console.log('API Request (Get Airlines):', requestData);

        const response = await axios.post<Airline[]>(
            'http://localhost:8080/api/v1/get-airline',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('API Response (Get Airlines):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching airlines:', error);
        throw error;
    }
};

// Interfaz para el aeropuerto
export interface Airport {
    id: number;
    iata: string;
    name: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

/**
 * Función para obtener la lista de aeropuertos desde el backend.
 * Realiza una petición POST al endpoint /api/v1/get-airport.
 * 
 * @returns Promesa con la lista de aeropuertos (Airport[])
 */
export const getAirports = async (): Promise<Airport[]> => {
    try {
        console.log('API Request (Get Airports): {}');

        const response = await axios.post<Airport[]>(
            'http://localhost:8080/api/v1/get-airport',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('API Response (Get Airports):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching airports:', error);
        throw error;
    }
};
