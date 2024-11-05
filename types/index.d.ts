declare module 'types' {
  /* eslint-disable no-unused-vars */
  import * as React from 'react';

  // Search and Navigation Types
  export type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };

  // User Related Types
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

  // Problem and Category Types
  export type Problem = {
    id: string | number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    link: string;
    description?: string;
    cases?: TestCase[];
    constraints?: {
      [key: string]: boolean;
    };
    completed?: boolean;
  };

  export type ProblemId = string | number;

  export type Category = {
    id: string;
    name: string;
    problems: Problem[];
  };

  // Monaco Editor Types
  export interface MonacoEditorRef {
    getValue: () => string;
    setValue: (value: string) => void;
    getModel: () => any;
    updateOptions: (options: any) => void;
  }

  export interface MonacoEditorProps {
    height?: string | number;
    defaultLanguage?: string;
    language?: string;
    value?: string;
    theme?: string;
    options?: {
      minimap?: { enabled: boolean };
      fontSize?: number;
      lineNumbers?: 'on' | 'off';
      formatOnType?: boolean;
      formatOnPaste?: boolean;
      automaticLayout?: boolean;
      [key: string]: any;
    };
    onChange?: (value: string | undefined) => void;
    onMount?: (editor: MonacoEditorRef, monaco: any) => void;
  }

  // Code Execution Types
  export interface ExecutionError extends Error {
    message: string;
    name: string;
    stack?: string;
  }

  export interface CodeExecutionResult {
    run: {
      stdout: string;
      stderr: string;
      output: string;
      code: number;
      signal: null | string;
      error?: ExecutionError;
    };
  }

  // Component Props Types
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

  export interface HeaderBoxProps {
    type?: 'title' | 'greeting';
    title: string;
    subtext?: string;
    user?: string;
  }

  export interface FooterProps {
    user: User | null;
    type?: 'mobile' | 'desktop';
  }

  export interface SiderbarProps {
    user: User | null;
  }

  export interface MobileNavProps {
    user: User | null;
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

  // Question and Test Case Types
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

  export type ProblemExtended = Omit<
    QuestionCategory['problems'][0],
    'link'
  > & {
    category: string;
    description: string;
    testCases: TestCase[];
  };

  // Goal Related Types
  export interface Goal {
    id: string | number;
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
    onUpdateProgress: (goalId: string | number, change: number) => void;
    onDelete: (goalId: string | number) => void;
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
    updateGoalProgress: (goalId: string | number, change: number) => void;
    deleteGoal: (goalId: string | number) => void;
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
    completedProblems: Set<ProblemId>;
    totalProblems: number;
    toggleProblemCompletion: (problemId: ProblemId) => void;
    updateProgress?: (problemId: ProblemId) => void;
    resetProgress?: () => void;
    goals?: Goal[];
    updateGoalProgress?: (goalId: ProblemId, change: number) => void;
  }
  export type ProgressHandler = {
    completedProblems: Set<ProblemId>;
    updateProgress: (problemId: ProblemId, completed: boolean) => void;
    resetProgress: () => void;
  };

  // Misc Types
  export type Bank = unknown;
  export type Account = unknown;
  export type Transaction = unknown;

  export interface RightSidebarProps {
    user: User | null;
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

// Monaco Editor module declaration
declare module '@monaco-editor/react' {
  import * as React from 'react';
  import { MonacoEditorProps } from 'types';

  export const Editor: React.ComponentType<MonacoEditorProps>;
  export default Editor;
}

// Set iteration support
interface Set<T> {
  [Symbol.iterator](): IterableIterator<T>;
}

export {};
