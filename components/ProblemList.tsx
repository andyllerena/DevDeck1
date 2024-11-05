'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type {
  Category,
  Problem,
  ProblemId,
  ProgressContextType,
} from '@/types';
import { useProgress } from './ProgressContent';

const ITEMS_PER_PAGE = 25;

interface ProblemsListProps {
  categories: Category[];
}

const ProblemsList = ({ categories: initialCategories }: ProblemsListProps) => {
  const { completedProblems, updateProgress, resetProgress } = useProgress();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');
  const [currentPage, setCurrentPage] = useState(1);

  // Update categories when completed problems change
  useEffect(() => {
    setCategories(prevCategories =>
      prevCategories.map(category => ({
        ...category,
        problems: category.problems.map(problem => ({
          ...problem,
          completed: completedProblems.has(problem.id),
        })),
      })),
    );
  }, [completedProblems]);

  // Filtering logic
  const filterProblems = (problems: Problem[]) => {
    return problems.filter(problem => {
      const matchesDifficulty =
        selectedDifficulty === 'all' ||
        problem.difficulty === selectedDifficulty;
      const matchesCompletion =
        !showCompleted || (showCompleted && completedProblems.has(problem.id));

      return matchesDifficulty && matchesCompletion;
    });
  };

  const handleProblemToggle = (problemId: ProblemId) => {
    // Use updateProgress from context instead of undefined toggleProblemCompletion
    updateProgress(problemId, !completedProblems.has(problemId));
  };

  const getAllProblems = (): Problem[] => {
    if (selectedCategory === 'all') {
      return categories.reduce((allProblems: Problem[], category) => {
        return [...allProblems, ...category.problems];
      }, []);
    }
    return (
      categories.find(category => category.id === selectedCategory)?.problems ||
      []
    );
  };

  const getDisplayedProblems = () => {
    const filteredProblems = filterProblems(getAllProblems());
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProblems.slice(startIndex, endIndex);
  };

  const totalFilteredProblems = filterProblems(getAllProblems()).length;
  const totalPages = Math.ceil(totalFilteredProblems / ITEMS_PER_PAGE);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (categoryId === 'all') {
      setActiveTab(categories[0]?.id || '');
    } else {
      setActiveTab(categoryId);
    }
  };

  return (
    <section className="problems-list-section p-6 bg-white rounded-lg shadow-md">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Blind 75</h2>
          <h3 className="text-sm text-gray-500">by NeetCode</h3>
        </div>
        <Button
          onClick={resetProgress}
          variant="outline"
          className="border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 text-red-600 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Reset Progress
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
        <select
          value={selectedCategory}
          onChange={e => handleCategoryChange(e.target.value)}
          className="border p-2 rounded-md text-gray-600 font-semibold"
        >
          <option value="all">All Topics</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          className="border p-2 rounded-md text-gray-600 font-semibold"
        >
          <option value="all">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={() => setShowCompleted(!showCompleted)}
          />
          <label
            htmlFor="show-completed"
            className="text-gray-600 font-semibold cursor-pointer"
          >
            Show Completed Only
          </label>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        <ul className="divide-y divide-gray-200">
          {getDisplayedProblems().map(problem => (
            <li key={problem.id} className="problem-item py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id={`problem-${problem.id}`}
                      checked={completedProblems.has(problem.id)}
                      onCheckedChange={() => handleProblemToggle(problem.id)}
                      className="h-5 w-5"
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                      problem.difficulty === 'Easy'
                        ? 'bg-green-200 text-green-700'
                        : problem.difficulty === 'Medium'
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-red-200 text-red-700'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <Link href={problem.link}>
                    <span className="text-sm sm:text-lg font-medium text-blue-600 hover:underline">
                      {problem.title}
                    </span>
                  </Link>
                </div>

                {completedProblems.has(problem.id) && (
                  <span className="text-xs font-semibold text-green-600">
                    Completed
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
export default ProblemsList;
