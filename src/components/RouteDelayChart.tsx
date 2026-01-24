import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell
} from 'recharts';
import { fetchRouteDelays, type Airline } from '../services/api';
import { Loader2, AlertCircle, Info } from 'lucide-react';

interface RouteDelayChartProps {
    originId: number | null;
    destinationId: number | null;
    airlines: Airline[];
}

interface AirlineStats {
    airlineId: string;
    airlineName: string;
    avgDelay: number;
    maxDelay: number;
    count: number;
}

export const RouteDelayChart: React.FC<RouteDelayChartProps> = ({ originId, destinationId, airlines }) => {
    const [data, setData] = useState<AirlineStats[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            // Reset si no hay selección válida
            if (!originId || !destinationId || originId === 0 || destinationId === 0 || originId === destinationId) {
                setData([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const result = await fetchRouteDelays(originId, destinationId);

                // Procesamiento de datos: Agrupar por Aerolínea
                const statsMap = new Map<string, { totalTime: number; maxTime: number; count: number }>();

                result.forEach(item => {
                    const current = statsMap.get(item.aerolinea) || { totalTime: 0, maxTime: 0, count: 0 };
                    statsMap.set(item.aerolinea, {
                        totalTime: current.totalTime + item.tiempo,
                        maxTime: Math.max(current.maxTime, item.tiempo),
                        count: current.count + 1
                    });
                });

                // Convertir a array para el gráfico
                const chartData: AirlineStats[] = Array.from(statsMap.entries()).map(([airlineId, stats]) => {
                    const airlineInfo = airlines.find(a => String(a.id) === airlineId);
                    return {
                        airlineId,
                        airlineName: airlineInfo ? airlineInfo.fullName : `ID ${airlineId}`,
                        avgDelay: Number((stats.totalTime / stats.count).toFixed(2)),
                        maxDelay: Number(stats.maxTime.toFixed(2)),
                        count: stats.count
                    };
                });

                // Ordenar por menor retraso primero (mejor rendimiento)
                chartData.sort((a, b) => a.avgDelay - b.avgDelay);

                setData(chartData);

            } catch (err) {
                console.error("Error loading route delays:", err);
                setError("No se pudo cargar la información histórica de la ruta.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [originId, destinationId, airlines]);

    if (!originId || !destinationId) {
        return null;
    }

    if (originId === destinationId) {
        return (
            <div className="flex items-center text-orange-500 text-sm p-4 bg-orange-50 rounded-lg w-full mt-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                El origen y el destino no pueden ser iguales.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white/50 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Analizando ruta...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center text-orange-500 text-sm p-4 bg-orange-50 rounded-lg">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center text-gray-400 text-sm h-32 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Info className="h-4 w-4 mr-2" />
                No hay datos históricos para esta ruta específica.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full mt-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-l-4 border-indigo-500 pl-2">
                Comparativa de Retrasos en esta Ruta
            </h3>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="airlineName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500, textAnchor: 'end' }}
                            angle={-90}
                            interval={0}
                            height={120}
                            dy={5}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            unit=" min"
                        />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload as AirlineStats;
                                    return (
                                        <div className="bg-white p-2 border border-blue-100 shadow-xl rounded text-xs">
                                            <p className="font-bold text-blue-800 mb-1">{label}</p>
                                            <p>Promedio: <span className="font-semibold">{d.avgDelay} min</span></p>
                                            <p>Máximo: <span className="font-semibold">{d.maxDelay} min</span></p>
                                            <p>Muestras: <span className="text-gray-500">{d.count} meses</span></p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="avgDelay"
                            name="Retraso Promedio"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        >
                            {
                                data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#6366F1'} />
                                ))
                            }
                            <LabelList dataKey="avgDelay" position="top" fill="#6B7280" fontSize={11} formatter={(val) => `${val}m`} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[10px] text-gray-400 text-center">
                * El promedio se calcula basado en el histórico mensual disponible. Menor es mejor.
            </div>
        </div>
    );
};
