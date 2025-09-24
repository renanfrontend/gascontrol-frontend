// src/components/dashboard/ConsumptionChart.tsx
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ConsumptionChartProps = {
  data: { date: string; consumo: number }[];
};

export function ConsumptionChart({ data }: ConsumptionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} m³`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
          contentStyle={{ 
            backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 com transparência
            borderColor: 'rgba(55, 65, 81, 1)', // border-gray-700
            borderRadius: '0.5rem',
            color: '#fff'
          }}
          labelStyle={{ color: '#9ca3af' }} // text-gray-400
        />
        <Bar dataKey="consumo" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-violet-400" />
      </BarChart>
    </ResponsiveContainer>
  );
}