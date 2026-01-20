import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { getDelaysByMonth, type DelaysByMonthResponse } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';


interface DashboardChartProps {
    airlineId: number;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ airlineId }) => {
    const [data, setData] = useState<DelaysByMonthResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Si no hay aerolínea seleccionada (0), no intentamos buscar
            if (airlineId === 0) return;

            setIsLoading(true);
            try {
                const result = await getDelaysByMonth(airlineId);
                setData(result);
            } catch (err) {
                setError('Error al cargar los datos del dashboard.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [airlineId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Cargando estadísticas...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-500">
                <AlertCircle className="h-8 w-8 mb-2" />
                <span>{error}</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                No hay datos disponibles.
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
                Resumen Mensual: Vuelos vs Retrasos
            </h2>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="periodo"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFF',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            cursor={{ fill: '#F3F4F6' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        <Bar
                            dataKey="totalVuelos"
                            name="Total Vuelos"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="totalRetrasos"
                            name="Total Retrasos"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
