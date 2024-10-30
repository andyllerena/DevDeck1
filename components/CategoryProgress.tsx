const CategoryProgress = ({
  category,
  totalSolved,
}: {
  category: any;
  totalSolved: number;
}) => {
  const progress = (category.solved / category.total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">{category.name}</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          {category.solved} / {category.total} solved
        </span>
        <span>
          {((category.solved / totalSolved) * 100).toFixed(1)}% of total
        </span>
      </div>
    </div>
  );
};
