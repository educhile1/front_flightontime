
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import type { FlightData } from '../services/api';

interface FlightStatsProps {
    data: FlightData | null; // Datos del vuelo para mostrar, puede ser null si no hay datos
}

export const FlightStats: React.FC<FlightStatsProps> = ({ data }) => {
    // Si no hay datos, no renderizar nada
    if (!data) return null;

    // Preparar datos para el gráfico circular (PieChart)
    const chartData = [
        { name: 'On Time', value: data.onTimePercentage, color: '#4CC9F0' }, // Azul/Cian para tiempo
        { name: 'Delay', value: data.delayPercentage, color: '#6EE7E7' },    // Cian claro para retraso
    ];

    // Colores personalizados coincidiendo con el diseño visual (Tonos Teal/Cian)
    const COLORS = ['#3ab7bf', '#6ae6dd'];

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-64 h-64">
                {/* Gráfico Circular de Recharts */}
                <PieChart width={256} height={256}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                        stroke="none"
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>

                {/* Etiquetas superpuestas manualmente para coincidir con el diseño */}
                <div className="absolute top-0 left-0 text-[10px] text-gray-800 -translate-y-2 -translate-x-4 w-32 text-center leading-3">
                    Probabilidad de llegada puntual<br />
                    <span className="font-bold">{data.onTimePercentage}%</span>
                </div>

                <div className="absolute bottom-0 right-0 text-[10px] text-gray-800 translate-y-2 translate-x-4 w-32 text-center leading-3">
                    Probabilidad de llegada atrasada<br />
                    <span className="font-bold">{data.delayPercentage}%</span>
                </div>

            </div>

            {/* Sección inferior con el tiempo promedio de retraso */}
            <div className="mt-8 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Tiempo promedio de retraso Aerolinea</h3>
                <p className="text-4xl font-bold text-black">{data.averageDelayMinutes} minutos</p>
            </div>
        </div>
    );
};
