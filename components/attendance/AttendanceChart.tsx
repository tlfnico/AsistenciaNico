import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AttendanceChartProps {
    percentage: number;
    color: string; // e.g., '#10B981' for green
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ percentage, color }) => {
    const data = [
        { name: 'Attended', value: percentage },
        { name: 'Remaining', value: 100 - percentage },
    ];

    const COLORS = [color, '#F3F4F6']; // Active color and a neutral background color

    return (
        <div className="w-32 h-32 relative" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={50}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        dataKey="value"
                        cornerRadius={20}
                        stroke="none"
                    >
                         <Cell key={`cell-0`} fill={COLORS[0]} />
                         <Cell key={`cell-1`} fill={COLORS[1]} />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold" style={{ color: color }}>
                    {`${percentage}%`}
                </span>
            </div>
        </div>
    );
};

export default AttendanceChart;
