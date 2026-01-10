
import axios from 'axios';

export interface FlightPredictionRequest {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
}

export interface FlightPredictionResponse {
    id: string | null;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    delayProbability: number;
}

export interface FlightData {
    airline: string;
    onTimePercentage: number;
    delayPercentage: number;
    averageDelayMinutes: number;
}

export const fetchFlightPrediction = async (
    flightNumber: string,
    airline: string,
    origin: string,
    destination: string,
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

        console.log('API Request:', requestData);

        const response = await axios.post<FlightPredictionResponse>(
            'http://localhost:8080/api/v1/predict',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('API Response:', response.data);

        const { delayProbability } = response.data;

        // Convert delay probability to percentages
        const delayPercentage = Math.round(delayProbability * 100);
        const onTimePercentage = 100 - delayPercentage;

        // For now, we'll use a mock average delay minutes since the API doesn't provide it
        // In a real scenario, you might want to adjust this based on the delay probability
        const averageDelayMinutes = Math.round(delayProbability * 60); // Rough estimate

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
