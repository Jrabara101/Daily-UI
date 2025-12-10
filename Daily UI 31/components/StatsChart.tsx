import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalysisStats } from '../types';

interface StatsChartProps {
  stats: AnalysisStats;
}

const COLORS = ['#39ff14', '#b026ff', '#00d4ff', '#ff0055', '#ffff00'];

const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  if (stats.typeDistribution.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
        <p>No spectral data collected.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-700 backdrop-blur-sm">
      <h3 className="text-ecto-green font-bold mb-2 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">
        Ectoplasm Composition
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={stats.typeDistribution}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {stats.typeDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#4ade80', color: '#f8fafc' }}
            itemStyle={{ color: '#4ade80' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;