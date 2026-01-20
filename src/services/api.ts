
import axios from 'axios';

// Interfaz para la solicitud de predicción de vuelo
// Define los datos requeridos por el endpoint de predicción
export interface FlightPredictionRequest {
    flight: {
        flightNumber: string;
        airline: number;
        origin: number;
        destination: number;
        departureTime: string;
    };
    dayOfWeek: number;
    hour: number;
    minute: number;
    month: number;
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
 * Realiza una petición POST al endpoint /api/v1/predict-smart.
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
        const date = new Date(departureTime);

        // Mapeo de día de la semana: JS getDay() es 0 (Dom) - 6 (Sab).
        // Ajustamos a 1 (Lun) - 7 (Dom) para compatibilidad estándar ISO/Java.
        let dayOfWeek = date.getDay();
        if (dayOfWeek === 0) dayOfWeek = 7;

        const requestData: FlightPredictionRequest = {
            flight: {
                flightNumber,
                airline,
                origin,
                destination,
                departureTime,
            },
            dayOfWeek: dayOfWeek,
            hour: date.getHours(),
            minute: date.getMinutes(),
            month: date.getMonth() + 1 // JS meses son 0-11, API espera 1-12
        };

        console.log('API Request (Predicción de Vuelo):', requestData);

        // Llamada al servicio backend
        const response = await axios.post<FlightPredictionResponse>(
            'http://localhost:8080/api/v1/predict-smart',
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

// Interfaz para la respuesta del dashboard de retrasos por mes
export interface DelaysByMonthResponse {
    periodo: string;
    totalVuelos: number;
    totalRetrasos: number;
}

/**
 * Función para obtener las estadísticas de retrasos por mes.
 * Realiza una petición GET al endpoint /api/v1/dashboard/delays-by-month.
 * 
 * @param opUniqueCarrier ID de la aerolínea (por defecto 2 según requerimiento)
 * @returns Promesa con la lista de estadísticas mensuales
 */
export const getDelaysByMonth = async (opUniqueCarrier: number = 2): Promise<DelaysByMonthResponse[]> => {
    try {
        console.log(`API Request (Dashboard Delays): opUniqueCarrier=${opUniqueCarrier}`);

        const response = await axios.get<DelaysByMonthResponse[]>(
            `http://localhost:8080/api/v1/dashboard/delays-by-month?opUniqueCarrier=${opUniqueCarrier}`
        );

        console.log('API Response (Dashboard Delays):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard delays:', error);
        throw error;
    }
};


// ==========================================
// TRAVEL GUIDE SERVICE INTERFACES
// ==========================================

export interface TravelGuideRequest {
    latitude: string;
    longitude: string;
    travelDate: string; // Format: DD-MM
}

export interface InfoPais {
    idioma: string;
    moneda_codigo: string;
    tasa_propina_sugerida: string;
    e_sim_recomendada_url: string;
}

export interface TecnicoInfo {
    enchufes: string[];
    voltaje: string;
    frecuencia: string;
}

export interface EmergenciasInfo {
    numero_unico: string;
    policia: string;
    ambulancia: string;
}

export interface DestinoInfo {
    aeropuerto: string;
    ciudad: string;
    pais: string;
    info_pais: InfoPais;
    tecnico: TecnicoInfo;
    emergencias: EmergenciasInfo;
}

export interface MaletaItem {
    prenda: string;
    prioridad: string;
    link_google_search: string;
}

export interface AnalisisClimatico {
    resumen: string;
    temp_rango: string;
    riesgos_meteorologicos: string;
    maleta_inteligente: MaletaItem[];
}

export interface TransporteOption {
    medio: string;
    costo_estimado_usd: number;
    tiempo_minutos: number;
    horario_recomendado: string;
    metodo_pago: string;
}

export interface Coordenadas {
    lat: number;
    lng: number;
}

export interface NavegacionLinks {
    gmaps_nav: string;
    waze_nav: string;
}

export interface PuntoInteres {
    nombre: string;
    tipo: string;
    coordenadas: Coordenadas;
    color_hex: string;
    navegacion: NavegacionLinks;
    comentario_experto: string;
}

export interface GastronomiaInfo {
    platos_sugeridos_fecha: string[];
    bebida_tipica: string;
    precio_medio_menu_usd: number;
}

export interface InteligenciaSeguridad {
    nivel_riesgo: string;
    zonas_no_go: string[];
    estafas_comunes_activas: string[];
    frase_auxilio_local: string;
}

export interface TravelGuideResponse {
    destino: DestinoInfo;
    analisis_climatico_historico: AnalisisClimatico;
    logistica_transporte_aeropuerto: TransporteOption[];
    puntos_interes_georreferenciados: PuntoInteres[];
    gastronomia_estacional: GastronomiaInfo;
    inteligencia_seguridad: InteligenciaSeguridad;
}

/**
 * Servicio para obtener la Guía de Viaje Inteligente.
 * POST /api/v1/travel-guide
 */
export const fetchTravelGuide = async (latitude: string, longitude: string, travelDate: string): Promise<TravelGuideResponse> => {
    try {
        const requestData: TravelGuideRequest = {
            latitude,
            longitude,
            travelDate // Espera formato DD-MM
        };

        console.log('API Request (Travel Guide):', requestData);

        const response = await axios.post<TravelGuideResponse>(
            'http://localhost:8080/api/v1/travel-guide',
            requestData
        );

        console.log('API Response (Travel Guide):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching travel guide:', error);
        throw error;
    }
};


