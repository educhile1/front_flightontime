
import React from 'react';
import { FlightForm } from './components/FlightForm';
import { FlightStats } from './components/FlightStats';
import { fetchFlightPrediction, type FlightData } from './services/api';
import { fetchWeatherData, type WeatherResponse } from './services/WeatherService';
import { WeatherDisplay } from './components/WeatherDisplay';
import axios from 'axios';

function App() {
  // Estado para los datos del vuelo recibidos de la API
  const [data, setData] = React.useState<FlightData | null>(null);

  // Estado para los datos del clima
  const [weatherData, setWeatherData] = React.useState<WeatherResponse | null>(null);

  // Estado de carga para mostrar spinner o texto de "Cargando"
  const [isLoading, setIsLoading] = React.useState(false);

  // Mensaje de feedback para el usuario (éxito, error, o estado)
  const [message, setMessage] = React.useState<string | null>(null);

  // Estado de error para estilos condicionales (ej: color rojo)
  const [isError, setIsError] = React.useState(false);

  // Función principal para manejar la búsqueda.
  // Se invoca cuando el usuario presiona "Consultar" en el formulario.
  const handleSearch = async (flightNumber: string, airline: number, origin: number, destination: number, date: string, time: string) => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);

    // Validación básica: Origen y destino no pueden ser iguales
    if (origin === destination) {
      setIsError(true);
      setMessage('No es permitido: El origen y el destino no pueden ser iguales.');
      setIsLoading(false);
      setData(null);
      return;
    }

    // Mensaje inicial indicando que el proceso ha comenzado
    setMessage(`Consultando: Vuelo ${flightNumber} de ${origin} a ${destination} por ${airline} el ${date} a las ${time}. Analizando clima (puede tardar hasta 30s)...`);

    try {
      // Formatear la fecha para compatibilidad con las APIs (formato ISO/YYYY-MM-DD)
      const [day, month, year] = date.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const departureTime = `${formattedDate}T${time}:00`;

      // Llamada paralela a los dos servicios: Predicción de Vuelo y Clima

      // 1. Servicio de predicción de vuelo
      const flightDataPromise = fetchFlightPrediction(flightNumber, airline, origin, destination, departureTime);

      // 2. Servicio de clima (usando coordenadas placeholder por ahora, deberían venir de la selección de aeropuerto)
      // Se usa un timeout largo (60s) en el servicio porque la respuesta tarda ~30s.
      const weatherDataPromise = fetchWeatherData("55.408611", "37.90611", formattedDate);

      // Esperar a que ambas promesas se resuelvan
      const [flightData, weatherData] = await Promise.all([flightDataPromise, weatherDataPromise]);

      // Actualizar el estado con los datos del vuelo recibidos
      setData(flightData);
      setWeatherData(weatherData);

      console.log("Datos del Clima recibidos:", weatherData);

      // Confirmar al usuario que el análisis de clima también fue exitoso
      if (weatherData && weatherData.aiAnalysis) {
        setMessage(`Predicción completada. Clima analizado.`);
      }

    } catch (error) {
      // Manejo de errores global para la operación de búsqueda
      setIsError(true);
      // Mensaje de error detallado si es por timeout
      const errorMessage = axios.isAxiosError(error) && error.code === 'ECONNABORTED'
        ? ' Tiempo de espera agotado.'
        : '';

      setMessage('Error al consultar los servicios. Verifica que estén disponibles.' + errorMessage);
      setData(null);
      console.error('Error en la búsqueda:', error);
    } finally {
      // Finalizar el estado de carga independientemente del resultado
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 lg:p-4 font-sans">
      {/* Contenedor principal estilo "Laptop" */}
      <div className="bg-white w-full max-w-5xl lg:aspect-[16/10] min-h-screen lg:min-h-0 h-auto rounded-none lg:rounded-xl shadow-none lg:shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col relative border-0 lg:border-8 border-gray-200">

        {/* Barra superior estilo navegador (decorativa) */}
        <div className="h-8 border-b flex items-center px-4 bg-white shrink-0 sticky top-0 z-10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 lg:p-12 flex flex-col items-center overflow-y-auto lg:overflow-y-auto">

          <h1 className="text-3xl lg:text-4xl text-black font-medium mb-8 tracking-tight text-center">Revisión de vuelos</h1>

          {/* Mensajes de feedback (Error o Estado) */}
          {message && (
            <div className={`mb-8 px-6 py-3 rounded text-sm font-medium ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:items-start px-4 lg:px-16 gap-12 lg:gap-0 pb-8 lg:pb-0">
            {/* Columna Izquierda: Formulario */}
            <div className="w-full lg:w-1/3 flex justify-center lg:block">
              <FlightForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Columna Derecha: Gráfico de Estadísticas */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <FlightStats data={data} />
            </div>
          </div>

          {/* Sección de Clima */}
          {weatherData && (
            <div className="w-full px-4 lg:px-16 pb-12">
              <WeatherDisplay data={weatherData} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
