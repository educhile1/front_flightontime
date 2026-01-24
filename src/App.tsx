
import React from 'react';
import { FlightForm } from './components/FlightForm';
import { FlightStats } from './components/FlightStats';
import { FlightMap } from './components/FlightMap';
import { fetchFlightPrediction, getAirlines, fetchTravelGuide, fetchRouteDelays, type FlightData, type Airport, type Airline, type TravelGuideResponse } from './services/api';
import axios from 'axios';

import { DashboardChart } from './components/DashboardChart';
import { TravelGuide } from './components/TravelGuide';
import { RouteDelayChart } from './components/RouteDelayChart';
import { BarChart3, Plane, Map } from 'lucide-react';

function App() {
  // Estado para los datos del vuelo recibidos de la API
  const [data, setData] = React.useState<FlightData | null>(null);

  // Estados para el mapa: Aeropuertos seleccionados
  const [selectedOrigin, setSelectedOrigin] = React.useState<Airport | null>(null);
  const [selectedDestination, setSelectedDestination] = React.useState<Airport | null>(null);

  // Estados para aerolíneas (Lifted State)
  const [airlines, setAirlines] = React.useState<Airline[]>([]);
  const [selectedAirline, setSelectedAirline] = React.useState<number>(0);

  // Estado para la Guía de Viaje
  const [travelGuide, setTravelGuide] = React.useState<TravelGuideResponse | null>(null);
  const [isGuideLoading, setIsGuideLoading] = React.useState(false);

  // Estado de carga para mostrar spinner o texto de "Cargando"
  const [isLoading, setIsLoading] = React.useState(false);

  // Mensaje de feedback para el usuario (éxito, error, o estado)
  const [message, setMessage] = React.useState<string | null>(null);

  // Estado de error para estilos condicionales (ej: color rojo)
  const [isError, setIsError] = React.useState(false);

  // Estado para mostrar vistas: 'search' | 'dashboard' | 'guide'
  const [currentView, setCurrentView] = React.useState<'search' | 'dashboard' | 'guide'>('search');

  // Cargar aerolíneas al inicio
  React.useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const airlinesData = await getAirlines();
        setAirlines(airlinesData);
        if (airlinesData.length > 0) {
          setSelectedAirline(airlinesData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    fetchAirlines();
  }, []);

  // Función para obtener la guía de viaje
  const handleFetchGuide = React.useCallback(async () => {
    if (!selectedDestination) {
      setMessage('Por favor selecciona un destino primero.');
      setIsError(true);
      return;
    }

    // Usamos una fecha por defecto si no hay una seleccionada en el form (no tenemos acceso directo al estado del form aqui aun)
    // TODO: Idealmente levantar el estado de fecha tambien a App.tsx.
    // Por ahora, asumimos "15-10" como ejemplo o la fecha actual.
    // Para una mejor UX, vamos a requerir que el usuario haga una búsqueda primero o comparta el estado.
    // SOLUCION RAPIDA: Usar la fecha actual formateada DD-MM
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const dateStr = `${day}-${month}`;

    setIsGuideLoading(true);
    setMessage('Generando Guía de Viaje con IA... esto puede tardar unos segundos.');
    setIsError(false);

    try {
      const guide = await fetchTravelGuide(
        String(selectedDestination.latitude),
        String(selectedDestination.longitude),
        dateStr
      );
      setTravelGuide(guide);
      setMessage('Guía generada exitosamente.');
    } catch (error) {
      console.error("Error fetching guide:", error);
      setMessage('Error al obtener la guía de viaje.');
      setIsError(true);
    } finally {
      setIsGuideLoading(false);
    }
  }, [selectedDestination]);

  // Efecto para cargar la guía cuando se cambia a la vista de guía si ya hay destino
  React.useEffect(() => {
    if (currentView === 'guide' && !travelGuide && selectedDestination) {
      handleFetchGuide();
    }
  }, [currentView, selectedDestination, handleFetchGuide, travelGuide]);


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

      // Llamada al servicio: Predicción de Vuelo
      const flightData = await fetchFlightPrediction(flightNumber, airline, origin, destination, departureTime);

      // --- LOGICA AGREGADA: Obtener tiempo promedio real histórico ---
      try {
        const routeDelays = await fetchRouteDelays(origin, destination);

        // Filtrar por la aerolínea seleccionada
        const airlineDelays = routeDelays.filter(d => String(d.aerolinea) === String(airline));

        if (airlineDelays.length > 0) {
          // Calcular promedio real
          const totalDelay = airlineDelays.reduce((sum, item) => sum + item.tiempo, 0);
          const avgDelay = totalDelay / airlineDelays.length;

          // Actualizar el valor simulado con el real (redondeado)
          flightData.averageDelayMinutes = Math.round(avgDelay);
          console.log(`Updated average delay from history: ${flightData.averageDelayMinutes} mins based on ${airlineDelays.length} records.`);
        } else {
          console.log("No historical data found for this airline on this route, keeping simulated delay.");
        }
      } catch (err) {
        console.warn("Failed to fetch historical delays for stats, keeping prediction default.", err);
      }
      // ---------------------------------------------------------------

      // Actualizar el estado con los datos del vuelo recibidos
      setData(flightData);

      setMessage(`Predicción completada.`);

    } catch (error) {
      // Manejo de errores global para la operación de búsqueda
      setIsError(true);
      // Mensaje de error detallado si es por timeout
      const errorMessage = axios.isAxiosError(error) && error.code === 'ECONNABORTED'
        ? ' Tiempo de espera agotado.'
        : '';

      setMessage('Error al consultar el servicio. Verifica que esté disponible.' + errorMessage);
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
        <div className="h-8 border-b flex items-center justify-between px-4 bg-white shrink-0 sticky top-0 z-10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('search')}
              className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${currentView === 'search' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Plane size={12} />
              Buscador
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <BarChart3 size={12} />
              Estadísticas
            </button>
            <button
              onClick={() => setCurrentView('guide')}
              className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${currentView === 'guide' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Map size={12} />
              Guía de Viaje
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 lg:p-12 flex flex-col items-center overflow-y-auto lg:overflow-y-auto">

          <h1 className="text-3xl lg:text-4xl text-black font-medium mb-8 tracking-tight text-center">
            {currentView === 'search' && 'Revisión de vuelos'}
            {currentView === 'dashboard' && 'Estadísticas Mensuales'}
            {currentView === 'guide' && 'Guía de Viaje Inteligente'}
          </h1>

          {/* Mensajes de feedback (Error o Estado) */}
          {message && currentView === 'search' && (
            <div className={`mb-8 px-6 py-3 rounded text-sm font-medium ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
              {message}
            </div>
          )}
          {/* Mensaje especial para guía de viaje */}
          {(message || isGuideLoading) && currentView === 'guide' && (
            <div className={`mb-8 px-6 py-3 rounded text-sm font-medium ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
              {message || 'Cargando información...'}
            </div>
          )}


          {currentView === 'dashboard' && (
            <div className="w-full h-full flex flex-col items-center">
              <DashboardChart airlineId={selectedAirline} />
            </div>
          )}

          {currentView === 'guide' && (
            <div className="w-full h-full flex flex-col items-center">
              {!selectedDestination ? (
                <div className="text-gray-500 italic">Selecciona un destino en el "Buscador" para generar la guía.</div>
              ) : (
                isGuideLoading ? (
                  <div className="text-gray-500">Generando tu guía personalizada...</div>
                ) : (
                  travelGuide && <TravelGuide data={travelGuide} />
                )
              )}
            </div>
          )}

          {currentView === 'search' && (
            <div className="flex flex-col lg:flex-row w-full justify-between items-start gap-8 px-2 lg:px-8 h-full">
              {/* Columna Izquierda: Formulario (Fijo) */}
              <div className="w-full lg:w-1/3 flex justify-center lg:block shrink-0">
                <FlightForm
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  onOriginChange={setSelectedOrigin}
                  onDestinationChange={setSelectedDestination}
                  airlines={airlines}
                  selectedAirline={selectedAirline}
                  onAirlineChange={setSelectedAirline}
                />
              </div>

              {/* Columna Derecha: Mapa y Estadísticas (Flexible) */}
              <div className="w-full lg:w-2/3 flex flex-col gap-6 h-full pb-8">

                {/* Mapa: Solo se muestra si origen y destino son diferentes */}
                {selectedOrigin?.id !== selectedDestination?.id && (
                  <div className="w-full h-80 lg:h-96 shrink-0">
                    <FlightMap origin={selectedOrigin} destination={selectedDestination} />
                  </div>
                )}

                {/* Gráfico de Comparativa de Ruta */}
                <RouteDelayChart
                  originId={selectedOrigin?.id || null}
                  destinationId={selectedDestination?.id || null}
                  airlines={airlines}
                />

                {/* Estadísticas (se muestran solo cuando hay datos) */}
                {data && (
                  <div className="w-full flex justify-center items-center animate-fade-in">
                    <FlightStats data={data} />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
