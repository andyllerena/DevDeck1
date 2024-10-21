import React from 'react';
import DoughnutChart from './DoughnutChart';

const ProgressBox = ({
  totalProblems,
  completedProblems,
  progressPercentage,
}: ProgressBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart
          completedProblems={completedProblems}
          totalProblems={totalProblems}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Number of Problems: {totalProblems}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Completed Problems: {completedProblems}
          </p>
          <div>
            <p className="total-balance-amount flex-center gap-2">
              Progress Percentage: {progressPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressBox;
