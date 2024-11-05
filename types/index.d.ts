declare module 'types' {
  /* eslint-disable no-unused-vars */
  export type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };

  export type SignUpParams = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  export type LoginUser = {
    email: string;
    password: string;
  };

  export type User = {
    $id: string;
    email: string;
    userId: string;
    firstName: string;
    lastName: string;
    name: string;
  };

  export type NewUserParams = {
    userId: string;
    email: string;
    name: string;
    password: string;
  };

  export type Problem = {
    id: string;
    title: string;
    difficulty: string;
    link: string;
    completed?: boolean;
  };

  export type Category = {
    id: string;
    name: string;
    problems: Problem[];
  };

  export type ProblemsListProps = {
    categories: Category[];
  };

  export type ProgressProviderProps = {
    children: React.ReactNode;
    categories: Category[];
  };

  export interface AuthFormProps {
    type: 'sign-in' | 'sign-up';
  }

  export interface ProgressBoxProps {
    totalProblems: number;
    completedProblems: number;
    progressPercentage: number;
  }

  export interface FooterProps {
    user: User;
    type?: 'mobile' | 'desktop';
  }

  export interface SiderbarProps {
    user: User;
  }

  export interface DoughnutChartProps {
    completedProblems: number;
    totalProblems: number;
  }

  export interface signInProps {
    email: string;
    password: string;
  }

  export interface getUserInfoProps {
    userId: string;
  }

  export interface QuestionCategory {
    id: string;
    name: string;
    problems: {
      id: number;
      title: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      link: string;
    }[];
  }

  export interface TestCase {
    id: number;
    input: any;
    output: any;
    explanation: string;
  }

  export interface TestCaseData {
    title: string;
    description: string;
    cases: TestCase[];
    constraints: Record<string, boolean>;
  }

  export type ProblemExtended = Omit<
    QuestionCategory['problems'][0],
    'link'
  > & {
    category: string;
    description: string;
    testCases: TestCase[];
  };

  // Goal Types
  export interface Goal {
    id: string;
    type: 'daily' | 'category';
    title: string;
    current: number;
    target: number;
    category?: string;
    streak: number;
    lastUpdated: string;
    completed?: boolean;
  }

  export interface GoalCardProps {
    goal: Goal;
    onUpdateProgress: (goalId: string, change: number) => void;
    onDelete: (goalId: string) => void;
  }

  export interface AddGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (goal: Goal) => void;
  }

  export interface GoalsSectionProps {
    user?: User;
  }

  export interface StorageUtils {
    getLocalStorage: <T>(key: string, defaultValue: T) => T;
    setLocalStorage: <T>(key: string, value: T) => void;
  }

  export type GoalCategory = {
    id: string;
    name: string;
    icon: string;
    total: number;
  };

  export interface GoalProgress {
    completed: number;
    total: number;
  }

  export interface CategoryProgress {
    [categoryId: string]: GoalProgress;
  }

  export interface GoalManagement {
    addGoal: (goal: Goal) => void;
    updateGoalProgress: (goalId: string, change: number) => void;
    deleteGoal: (goalId: string) => void;
    getGoals: () => Goal[];
  }

  // Context Types
  export interface ProgressContextType {
    categoryProgress: {
      [categoryId: string]: {
        completed: number;
        total: number;
      };
    };
    completedProblems: number;
    totalProblems: number;
    toggleProblemCompletion: (problemId: string) => void;
    goals?: Goal[];
    updateGoalProgress?: (goalId: string, change: number) => void;
  }

  // Misc Types
  export type Bank = unknown; // Replace with actual bank type
  export type Account = unknown; // Replace with actual account type
  export type Transaction = unknown; // Replace with actual transaction type

  export interface RightSidebarProps {
    user: User;
    transactions: Transaction[];
    banks: (Bank & Account)[];
    goals?: Goal[];
  }

  export interface RecentTransactionsProps {
    accounts: Account[];
    transactions: Transaction[];
    appwriteItemId: string;
    page: number;
  }
}

export interface TestCase {
  id: number;
  input: any;
  output: any;
  explanation: string;
}

export interface Problem {
  title: string;
  description: string;
  cases: TestCase[];
  constraints: {
    [key: string]: boolean;
  };
}

export interface TestCasesData {
  metadata: {
    version: string;
    lastUpdated: string;
    totalProblems: number;
    format: {
      input: string;
      output: string;
      timeLimit: string;
      memoryLimit: string;
    };
  };
  testCases: {
    [key: string]: Problem;
  };
}
export interface CodeExecutionResult {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: null | string;
  };
}

export {};
