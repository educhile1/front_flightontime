import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './FlightForm.css'; // We will create this for custom overrides if needed

interface FlightFormProps {
    onSearch: (airline: string, origin: string, destination: string, date: string) => void;
    isLoading: boolean;
}

interface AirportOption {
    id: number;
    nombre: string;
    nombre_corto: string;
}

const ORIGENES: AirportOption[] = [
    { id: 1, nombre: 'Rio de Janeiro', nombre_corto: 'GIG' },
    { id: 2, nombre: 'São Paulo', nombre_corto: 'GRU' },
    { id: 3, nombre: 'Santiago', nombre_corto: 'SCL' },
    { id: 4, nombre: 'Buenos Aires', nombre_corto: 'EZE' },
    { id: 5, nombre: 'Miami', nombre_corto: 'MIA' },
    { id: 6, nombre: 'New York', nombre_corto: 'JFK' },
];

const DESTINOS: AirportOption[] = [
    { id: 1, nombre: 'São Paulo', nombre_corto: 'GRU' },
    { id: 2, nombre: 'Rio de Janeiro', nombre_corto: 'GIG' },
    { id: 3, nombre: 'Santiago', nombre_corto: 'SCL' },
    { id: 4, nombre: 'Buenos Aires', nombre_corto: 'EZE' },
    { id: 5, nombre: 'Miami', nombre_corto: 'MIA' },
    { id: 6, nombre: 'New York', nombre_corto: 'JFK' },
];

export const FlightForm: React.FC<FlightFormProps> = ({ onSearch, isLoading }) => {
    const [airline, setAirline] = useState('Latam');
    const [origin, setOrigin] = useState('GIG');
    const [destination, setDestination] = useState('GRU'); // Default to first logic or GRU
    const [startDate, setStartDate] = useState<Date | null>(new Date('2026-01-01T12:00:00'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = startDate ? startDate.toLocaleDateString('es-ES') : '';
        onSearch(airline, origin, destination, formattedDate);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Aerolinea</label>
                    <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        className="border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Origen</label>
                    <div className="relative">
                        <select
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {ORIGENES.map((opt) => (
                                <option key={opt.id} value={opt.nombre_corto}>
                                    {opt.nombre} ({opt.nombre_corto})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Destino</label>
                    <div className="relative">
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                        >
                            {DESTINOS.map((dest) => (
                                <option key={dest.id} value={dest.nombre_corto}>
                                    {dest.nombre} ({dest.nombre_corto})
                                </option>
                            ))}
                        </select>
                        {/* Custom arrow icon for better style consistency */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-700">Fecha</label>
                    <div className="w-full">
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-black transition-colors"
                            wrapperClassName="w-full"
                        />
                    </div>
                </div>

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
