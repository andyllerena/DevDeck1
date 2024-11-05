// components/ProgressBox.tsx
'use client';
import React from 'react';
import DoughnutChart from './DoughnutChart';

import { useProgress } from './ProgressContent';
const StatItem = ({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={`flex flex-col ${className}`}>
    <dt className="text-sm text-gray-500">{label}</dt>
    <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
  </div>
);

const ProgressBox = () => {
  const { completedProblems, totalProblems } = useProgress();
  const completed = completedProblems.size;
  const progressPercentage = (completed / totalProblems) * 100;

  return (
    <section className="flex gap-8 p-8 bg-white rounded-lg shadow-md">
      {/* Chart Section */}
      <div className="w-64">
        <DoughnutChart />
      </div>

      {/* Stats Section */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <dl className="grid grid-cols-1 gap-6">
          <StatItem
            label="Total Problems"
            value={totalProblems}
            className="p-4 bg-gray-50 rounded-lg"
          />
          <StatItem
            label="Completed Problems"
            value={completed}
            className="p-4 bg-blue-50 rounded-lg"
          />
          <StatItem
            label="Completion Rate"
            value={`${progressPercentage.toFixed(1)}%`}
            className="p-4 bg-green-50 rounded-lg"
          />
        </dl>
      </div>
    </section>
  );
};

export default ProgressBox;
