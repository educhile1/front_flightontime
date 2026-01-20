
import React, { useState, useEffect } from 'react';
import { getAirports, type Airline, type Airport } from '../services/api';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './FlightForm.css'; // Estilos personalizados para el formulario

// Props para el componente FlightForm
// Props para el componente FlightForm
interface FlightFormProps {
    // Función que se ejecuta al enviar el formulario con los datos seleccionados
    onSearch: (flightNumber: string, airline: number, origin: number, destination: number, date: string, time: string) => void;
    // Callbacks para notificar cambios en la selección de aeropuertos (para el mapa)
    onOriginChange?: (airport: Airport | null) => void;
    onDestinationChange?: (airport: Airport | null) => void;
    // Estado de carga para deshabilitar el botón durante la petición
    isLoading: boolean;
    // Props para manejo de aerolíneas (Lifted State)
    airlines: Airline[];
    selectedAirline: number;
    onAirlineChange: (airlineId: number) => void;
}

// Generar opciones de hora en intervalos de 30 minutos (00:00, 00:30, 01:00...)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0');
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
});

export const FlightForm: React.FC<FlightFormProps> = ({
    onSearch,
    onOriginChange,
    onDestinationChange,
    isLoading,
    airlines,
    selectedAirline,
    onAirlineChange
}) => {
    // Estados locales para los campos del formulario
    const [flightNumber, setFlightNumber] = useState('');
    // const [airlines, setAirlines] = useState<Airline[]>([]); // Eliminado: viene por props
    // const [airline, setAirline] = useState<number>(0); // Eliminado: viene por props
    const [airports, setAirports] = useState<Airport[]>([]);
    const [origin, setOrigin] = useState<number>(0); // ID de origen
    const [destination, setDestination] = useState<number>(0); // ID de destino

    // Fecha seleccionada (inicializada en una fecha fija para demostración, pero editable)
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState('00:00');

    // Helper para obtener datos del aeropuerto seleccionado
    const getSelectedAirport = (id: number) => airports.find(a => a.id === id) || null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar aerolíneas y aeropuertos en paralelo
                // const [airlinesData, airportsData] = await Promise.all([
                //     getAirlines(),
                //     getAirports()
                // ]);
                // Solo cargamos aeropuertos aquí, las aerolíneas vienen del padre
                const airportsData = await getAirports();

                // setAirlines(airlinesData); // Manejado por el padre
                // if (airlinesData.length > 0) {
                //     setAirline(airlinesData[0].id);
                // }

                setAirports(airportsData);
                if (airportsData.length > 0) {
                    // Selección inicial inteligente
                    const firstId = airportsData[0].id;
                    setOrigin(firstId);
                    if (onOriginChange) onOriginChange(airportsData[0]);

                    let secondId = firstId;
                    if (airportsData.length > 1) {
                        secondId = airportsData[1].id;
                    }
                    setDestination(secondId);
                    if (onDestinationChange) onDestinationChange(airportsData.find(a => a.id === secondId) || null);
                }

            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        fetchData();
    }, []);

    // Manejador del envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Formatear la fecha a string simple
        const formattedDate = startDate ? startDate.toLocaleDateString('es-ES') : '';
        // Llamar a la función del padre para iniciar la búsqueda
        onSearch(flightNumber, selectedAirline, origin, destination, formattedDate, time);
    };

    // Handlers para cambios en selects
    const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setOrigin(id);
        if (onOriginChange) onOriginChange(getSelectedAirport(id));
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setDestination(id);
        if (onDestinationChange) onDestinationChange(getSelectedAirport(id));
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Campo: Número de Vuelo */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Número de Vuelo</label>
                    <input
                        type="text"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors"
                        placeholder="Ej: AM123"
                        required
                    />
                </div>

                {/* Campo: Aerolínea */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Aerolinea</label>
                    <div className="relative">
                        <select
                            value={selectedAirline}
                            onChange={(e) => onAirlineChange(Number(e.target.value))}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {airlines.map((aero) => (
                                <option key={aero.id} value={aero.id}>
                                    {aero.fullName} ({aero.shortName})
                                </option>
                            ))}
                        </select>
                        {/* Icono de flecha */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Campo: Origen */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Origen</label>
                    <div className="relative">
                        <select
                            value={origin}
                            onChange={handleOriginChange}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.city} - {airport.name} ({airport.iata})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    {/* Coordenadas Origen */}
                    {origin !== 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Lat: {getSelectedAirport(origin)?.latitude}, Lon: {getSelectedAirport(origin)?.longitude}
                        </div>
                    )}
                </div>

                {/* Campo: Destino */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Destino</label>
                    <div className="relative">
                        <select
                            value={destination}
                            onChange={handleDestinationChange}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.city} - {airport.name} ({airport.iata})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    {/* Coordenadas Destino */}
                    {destination !== 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Lat: {getSelectedAirport(destination)?.latitude}, Lon: {getSelectedAirport(destination)?.longitude}
                        </div>
                    )}
                </div>

                {/* Campo: Fecha con DatePicker */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Fecha</label>
                    <div className="w-full">
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors"
                            wrapperClassName="w-full"
                            minDate={new Date()} // Restringe la selección a hoy o fechas futuras
                        />
                    </div>
                </div>

                {/* Campo: Hora */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Hora</label>
                    <div className="relative">
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {TIME_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Botón de envío */}
                <div className="mt-10">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-black text-white px-8 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Cargando...' : 'Consultar'}
                    </button>
                </div>

            </form>
        </div>
    );
};

