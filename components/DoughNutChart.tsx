'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  completedProblems,
  totalProblems,
}: DoughnutChartProps) => {
  const remainingProblems = totalProblems - completedProblems;

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Blind 75 Progress',
        data: [completedProblems, remainingProblems], // Use passed props to set data
        backgroundColor: ['#0747b6', '#E0E0E0'],
        hoverBackgroundColor: ['#2265d8', '#BDBDBD'],
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
