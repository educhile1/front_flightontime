import React, { useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import { getDelaysByMonth, type DelaysByMonthResponse } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';


interface DashboardChartProps {
    airlineId: number;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ airlineId }) => {
    const [data, setData] = useState<(DelaysByMonthResponse & { percentage: number })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Si no hay aerolínea seleccionada (0), no intentamos buscar
            if (airlineId === 0) return;

            setIsLoading(true);
            try {
                const result = await getDelaysByMonth(airlineId);
                // Pre-process data to calculate percentage
                const processedData = result.map(item => ({
                    ...item,
                    percentage: item.totalVuelos > 0
                        ? Number(((item.totalRetrasos / item.totalVuelos) * 100).toFixed(1))
                        : 0
                }));
                setData(processedData);
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
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="periodo"
                            axisLine={false}
                            tickLine={false}
                            tick={{ angle: -90, textAnchor: 'end', fill: '#6B7280' } as React.ComponentProps<typeof XAxis>['tick']}
                            dy={0}
                            interval={0}
                            height={70}
                            scale="band"
                            tickFormatter={(value) => {
                                // value format: "YYYY-MM"
                                const monthNames = [
                                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                                ];
                                const monthIndex = parseInt(value.split('-')[1]) - 1;
                                return monthNames[monthIndex] || value;
                            }}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280' }}
                            label={{ value: 'Cantidad de Vuelos', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#F59E0B' }}
                            unit="%"
                            domain={[0, 'auto']}
                            label={{ value: 'Porcentaje de Retrasos', angle: 90, position: 'insideRight', style: { fill: '#F59E0B' } }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    // Payload mapping: 
                                    // 0: Bar (Total Vuelos)
                                    // 1: Bar (Total Retrasos)
                                    // 2: Line (Percentage) - THIS MIGHT VARY DEPENDING ON ORDER

                                    // Safe access based on dataKey or name if preferred, but usually order is preserved
                                    const totalVuelosItem = payload.find(p => p.dataKey === 'totalVuelos');
                                    const totalRetrasosItem = payload.find(p => p.dataKey === 'totalRetrasos');
                                    const percentageItem = payload.find(p => p.dataKey === 'percentage');

                                    const totalVuelos = totalVuelosItem ? Number(totalVuelosItem.value) : 0;
                                    const totalRetrasos = totalRetrasosItem ? Number(totalRetrasosItem.value) : 0;
                                    const percentage = percentageItem ? Number(percentageItem.value) : 0;

                                    return (
                                        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                                            <p className="font-bold text-gray-800 mb-2">{label}</p>
                                            <div className="space-y-1">
                                                <p className="text-blue-600 text-sm flex justify-between gap-4">
                                                    <span>Total Vuelos:</span>
                                                    <span className="font-bold">{totalVuelos}</span>
                                                </p>
                                                <p className="text-red-500 text-sm flex justify-between gap-4">
                                                    <span>Total Retrasos:</span>
                                                    <span className="font-bold">{totalRetrasos}</span>
                                                </p>
                                                <div className="border-t border-gray-100 my-1 pt-1">
                                                    <p className="text-amber-500 text-sm flex justify-between gap-4 font-medium">
                                                        <span>Tasa de Retraso:</span>
                                                        <span>{percentage}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                            cursor={{ fill: '#F3F4F6' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="totalVuelos"
                            name="Total Vuelos"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="totalRetrasos"
                            name="Total Retrasos"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="percentage"
                            name="% Retrasos"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: '#F59E0B', r: 4 }}
                            activeDot={{ r: 6 }}
                        >
                            <LabelList dataKey="percentage" position="top" fill="#F59E0B" formatter={(value) => `${value}%`} />
                        </Line>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
