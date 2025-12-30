import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import type { FlightData } from '../services/api';

interface FlightStatsProps {
    data: FlightData | null;
}

export const FlightStats: React.FC<FlightStatsProps> = ({ data }) => {
    if (!data) return null;

    const chartData = [
        { name: 'On Time', value: data.onTimePercentage, color: '#4CC9F0' }, // Blue/Cyan
        { name: 'Delay', value: data.delayPercentage, color: '#6EE7E7' }, // Lighter cyan
    ];

    // Custom colors matching the image mostly (Cyan/Teal tones)
    // The image shows two shades of blue/teal.
    // One is ~#36B9CC (darker teal), One is ~#68E1DD (lighter teal)
    const COLORS = ['#3ab7bf', '#6ae6dd'];

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-64 h-64">
                {/* Labels outside the chart as in image? Image has them with text. */}
                {/* We can use absolute positioning for the labels 'Posibilidad salir en hora' etc */}

                {/* ResponsiveContainer causes issues with flex/modal sometimes (width -1 error). 
                    Since we have a fixed w-64 h-64 (256px) container, we can just set fixed size on PieChart. 
                */}
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

                {/* Labels overlay - Manually placed to match visual roughly */}
                <div className="absolute top-0 left-0 text-[10px] text-gray-800 -translate-y-2 -translate-x-4 w-32 text-center leading-3">
                    Posibilidad salir en hora<br />
                    <span className="font-bold">{data.onTimePercentage}%</span>
                </div>

                <div className="absolute bottom-0 right-0 text-[10px] text-gray-800 translate-y-2 translate-x-4 w-32 text-center leading-3">
                    Posibilidad de retraso<br />
                    <span className="font-bold">{data.delayPercentage}%</span>
                </div>

            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Tiempo promedio de retraso Aerolinea</h3>
                <p className="text-4xl font-bold text-black">{data.averageDelayMinutes} minutos</p>
            </div>
        </div>
    );
};
