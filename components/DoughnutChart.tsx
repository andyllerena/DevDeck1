// components/DoughnutChart.tsx
'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useProgress } from './ProgressContent';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const { completedProblems, totalProblems } = useProgress();
  const completed = completedProblems.size;
  const remaining = totalProblems - completed;

  const data = {
    datasets: [
      {
        data: [completed, remaining],
        backgroundColor: ['#0747b6', '#E8E8E8'],
        borderWidth: 0,
        hoverOffset: 0,
        spacing: 0,
      },
    ],
    labels: ['Completed', 'Remaining'],
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      {' '}
      {/* Centered container */}
      <Doughnut
        data={data}
        options={{
          cutout: '75%',
          radius: '100%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          maintainAspectRatio: true,
          responsive: true,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-semibold">
          {Math.round((completed / totalProblems) * 100)}%
        </p>
        <p className="text-sm text-gray-500">Complete</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
