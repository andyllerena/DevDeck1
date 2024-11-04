'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react';

// Updated interfaces to match your JSON structure
interface TestCase {
  id: number;
  input: any;
  output: any;
  explanation: string;
}

interface Problem {
  title: string;
  description: string;
  cases: TestCase[];
  constraints: {
    [key: string]: boolean;
  };
}

interface TestCasesData {
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

const LANGUAGES = {
  python: 'Python 3.10',
  javascript: 'Node.js 18.15',
  typescript: 'TypeScript 5.0',
  java: 'Java 17',
  cpp: 'C++ 17',
};

const CodeAssessment = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedProblems, setSelectedProblems] = useState<[string, Problem][]>(
    [],
  );
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [language, setLanguage] = useState('python');
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState<{ [key: string]: string }>({});
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  // Function to fetch and select random problems from testcases.json
  const selectRandomProblems = async () => {
    try {
      const response = await fetch('/testcases.json');
      const data: TestCasesData = await response.json();

      // Convert testCases object to array of entries
      const problemEntries = Object.entries(data.testCases);

      // Randomly select 3 problems
      const selectedEntries: [string, Problem][] = [];
      const totalProblems = problemEntries.length;
      const indicesToSelect = new Set<number>();

      while (indicesToSelect.size < Math.min(3, totalProblems)) {
        indicesToSelect.add(Math.floor(Math.random() * totalProblems));
      }

      Array.from(indicesToSelect).forEach(index => {
        selectedEntries.push(problemEntries[index]);
      });

      setSelectedProblems(selectedEntries);

      // Initialize code state for each problem
      const initialCode: { [key: string]: string } = {};
      selectedEntries.forEach(([id, problem]) => {
        // Generate starter code template based on the problem
        const starterCode = generateStarterCode(id, problem, language);
        initialCode[id] = starterCode;
      });
      setCode(initialCode);
    } catch (error) {
      console.error('Error loading problems:', error);
      setOutput(['Error loading problems. Please try again.']);
    }
  };

  // Function to generate starter code template based on problem
  const generateStarterCode = (
    id: string,
    problem: Problem,
    lang: string,
  ): string => {
    const firstCase = problem.cases[0];
    let code = '';

    switch (lang) {
      case 'python':
        code = `def solve(${Object.keys(firstCase.input).join(', ')}):
    # Write your code here
    pass

# Example usage:
# ${Object.entries(firstCase.input)
          .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
          .join('\n# ')}
# result = solve(${Object.keys(firstCase.input).join(', ')})
# print(result)  # Expected output: ${JSON.stringify(firstCase.output)}
`;
        break;
      case 'javascript':
        code = `/**
 * ${problem.description}
 */
function solve(${Object.keys(firstCase.input).join(', ')}) {
    // Write your code here
}

// Example usage:
// const ${Object.entries(firstCase.input)
          .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
          .join('\n// const ')}
// const result = solve(${Object.keys(firstCase.input).join(', ')});
// console.log(result);  // Expected output: ${JSON.stringify(firstCase.output)}
`;
        break;
      // Add more language templates as needed
      default:
        code = `// Template not available for ${lang}`;
    }

    return code;
  };

  const startAssessment = async () => {
    selectRandomProblems();
    setIsStarted(true);
    setShowModal(false);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    if (!editorRef.current) return;
    setIsRunning(true);
    try {
      const sourceCode = editorRef.current.getValue();
      const currentProblem = selectedProblems[currentProblemIndex][1];

      // Run tests against all test cases
      const results = [`Running tests for ${currentProblem.title}...`, ''];

      currentProblem.cases.forEach((testCase, index) => {
        results.push(`Test Case ${index + 1}:`);
        results.push(`Input: ${JSON.stringify(testCase.input)}`);
        results.push(`Expected Output: ${JSON.stringify(testCase.output)}`);
        results.push('---');
      });

      setOutput(results);
    } catch (error) {
      setOutput(['Error running code:', error.message]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isStarted && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStarted, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const navigateProblems = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    } else if (
      direction === 'next' &&
      currentProblemIndex < selectedProblems.length - 1
    ) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const currentProblem = selectedProblems[currentProblemIndex]?.[1];
  const currentProblemId = selectedProblems[currentProblemIndex]?.[0];

  return (
    <div className="h-screen flex flex-col">
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Coding Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              You will be presented with 3 random problems to solve. You have 45
              minutes to complete all problems. You can navigate between
              problems at any time. Good luck!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => startAssessment()}>
              Start Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isStarted && currentProblem && (
        <div className="flex flex-col h-full">
          {/* Top Navigation Bar */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                Problem {currentProblemIndex + 1}/3: {currentProblem.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Problem Navigation */}
          <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={() => navigateProblems('prev')}
              disabled={currentProblemIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex gap-2">
              {selectedProblems.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded ${
                    index === currentProblemIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setCurrentProblemIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={() => navigateProblems('next')}
              disabled={currentProblemIndex === selectedProblems.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Problem Description */}
            <div className="w-2/5 border-r border-gray-200 bg-white dark:bg-gray-900 overflow-y-auto">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    className={`px-4 py-2 ${
                      activeTab === 'description'
                        ? 'border-b-2 border-blue-500'
                        : ''
                    }`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  {/* <button
                    className={`px-4 py-2 ${
                      activeTab === 'solution'
                        ? 'border-b-2 border-blue-500'
                        : ''
                    }`}
                    onClick={() => setActiveTab('solution')}
                  >
                    Solution
                  </button> */}
                </div>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">
                    {currentProblem.description}
                  </p>

                  <h3 className="text-lg font-semibold mt-6">Examples:</h3>
                  {currentProblem.cases.slice(0, 2).map(testCase => (
                    <div
                      key={testCase.id}
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div className="font-mono">
                        <div className="text-gray-600 dark:text-gray-400">
                          Input: {JSON.stringify(testCase.input, null, 2)}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Output: {JSON.stringify(testCase.output, null, 2)}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mt-2">
                          Explanation: {testCase.explanation}
                        </div>
                      </div>
                    </div>
                  ))}

                  <h3 className="text-lg font-semibold mt-6">Constraints:</h3>
                  <ul className="list-disc pl-6">
                    {Object.keys(currentProblem.constraints || {}).map(
                      (constraint, index) => (
                        <li
                          key={index}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {constraint}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Panel - Editor and Console */}
            <div className="flex-1 flex flex-col">
              {/* Language Selector and Run Button */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center">
                <select
                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border rounded"
                  value={language}
                  onChange={e => {
                    setLanguage(e.target.value);
                    // Regenerate starter code for new language
                    if (currentProblemId) {
                      const newCode = generateStarterCode(
                        currentProblemId,
                        currentProblem,
                        e.target.value,
                      );
                      setCode(prev => ({
                        ...prev,
                        [currentProblemId]: newCode,
                      }));
                    }
                  }}
                >
                  {Object.entries(LANGUAGES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    Run
                  </button>
                  <button className="px-4 py-1.5 bg-green-700 text-white rounded hover:bg-green-800">
                    Submit
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage={language}
                  language={language}
                  theme="vs-dark"
                  value={currentProblemId ? code[currentProblemId] : ''}
                  onChange={value => {
                    if (currentProblemId) {
                      setCode(prev => ({
                        ...prev,
                        [currentProblemId]: value || '',
                      }));
                    }
                  }}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    formatOnType: true,
                    formatOnPaste: true,
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* Console Output */}
              <div className="h-48 bg-gray-900 text-white overflow-y-auto">
                <div className="flex items-center p-2 border-b border-gray-700">
                  <span className="text-sm font-semibold">Console</span>
                </div>
                <div className="p-4 font-mono text-sm">
                  {output.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeAssessment;
