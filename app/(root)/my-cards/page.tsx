// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { Editor } from '@monaco-editor/react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Timer, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
// import questions from './questions.json';
// import "testCases" from './testcases.json';

// // Interfaces
// interface TestCase {
//   id: number;
//   input: any;
//   output: any;
//   explanation: string;
// }

// interface Problem {
//   id: number;
//   title: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
//   description: string;
//   category: string;
//   testCases: TestCase[];
// }

// interface QuestionCategory {
//   id: string;
//   name: string;
//   problems: {
//     id: number;
//     title: string;
//     difficulty: string;
//     link: string;
//   }[];
// }

// const LANGUAGES = {
//   python: 'Python 3.10',
//   javascript: 'Node.js 18.15',
//   typescript: 'TypeScript 5.0',
//   java: 'Java 17',
//   cpp: 'C++ 17',
// };

// const CodeAssessment = () => {
//   // State declarations
//   const [showModal, setShowModal] = useState(true);
//   const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
//   const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
//   const [isStarted, setIsStarted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
//   const [language, setLanguage] = useState('python');
//   const [activeTab, setActiveTab] = useState('description');
//   const [code, setCode] = useState<{ [key: number]: string }>({});
//   const [output, setOutput] = useState<string[]>([]);
//   const [isRunning, setIsRunning] = useState(false);
//   const editorRef = useRef(null);

//   // Function to get random items from array
//   const getRandomItems = <T extends any>(arr: T[], count: number): T[] => {
//     const shuffled = [...arr].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, count);
//   };

//   // Function to select random problems
//   const selectRandomProblems = () => {
//     try {
//       // Flatten all problems from categories into a single array
//       const allProblems = questionsData.flatMap((category: QuestionCategory) =>
//         category.problems.map(problem => ({
//           ...problem,
//           category: category.name,
//         })),
//       );

//       // Select 3 random problems
//       const randomProblems = getRandomItems(allProblems, 3);

//       // Create full problem objects with test cases
//       const problems = randomProblems.map(problem => {
//         const testCaseInfo = testcasesData.testCases[problem.id.toString()];

//         if (!testCaseInfo) {
//           throw new Error(`Test cases not found for problem ${problem.id}`);
//         }

//         return {
//           id: problem.id,
//           title: problem.title,
//           difficulty: problem.difficulty as 'Easy' | 'Medium' | 'Hard',
//           category: problem.category,
//           description: testCaseInfo.description,
//           testCases: testCaseInfo.cases,
//         };
//       });

//       setSelectedProblems(problems);

//       // Initialize code state for each problem
//       const initialCode = {};
//       problems.forEach(problem => {
//         initialCode[problem.id] = '';
//       });
//       setCode(initialCode);
//     } catch (error) {
//       console.error('Error selecting random problems:', error);
//       setOutput(['Error loading problems. Please try again.']);
//     }
//   };

//   const startAssessment = () => {
//     selectRandomProblems();
//     setIsStarted(true);
//     setShowModal(false);
//   };

//   const handleEditorDidMount = editor => {
//     editorRef.current = editor;
//   };

//   // Timer effect
//   useEffect(() => {
//     let intervalId: NodeJS.Timeout | undefined;
//     if (isStarted && timeLeft > 0) {
//       intervalId = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     }
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isStarted, timeLeft]);

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const runCode = async () => {
//     if (!editorRef.current) return;
//     setIsRunning(true);
//     try {
//       const sourceCode = editorRef.current.getValue();
//       const currentProblem = selectedProblems[currentProblemIndex];
//       setOutput([
//         'Running test cases for: ' + currentProblem.title,
//         '',
//         'Source code:',
//         sourceCode,
//         '',
//         'Test cases:',
//         ...currentProblem.testCases.map(
//           tc =>
//             `Input: ${JSON.stringify(tc.input)}\nExpected: ${JSON.stringify(
//               tc.output,
//             )}`,
//         ),
//       ]);
//     } catch (error) {
//       setOutput(['Error running code:', error.message]);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const navigateProblems = (direction: 'prev' | 'next') => {
//     if (direction === 'prev' && currentProblemIndex > 0) {
//       setCurrentProblemIndex(currentProblemIndex - 1);
//     } else if (
//       direction === 'next' &&
//       currentProblemIndex < selectedProblems.length - 1
//     ) {
//       setCurrentProblemIndex(currentProblemIndex + 1);
//     }
//   };

//   const currentProblem = selectedProblems[currentProblemIndex];

//   const startAssessment = () => {
//     selectRandomProblems();
//     setIsStarted(true);
//     setShowModal(false);
//   };

//   const handleEditorDidMount = editor => {
//     editorRef.current = editor;
//   };

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout | undefined;
//     if (isStarted && timeLeft > 0) {
//       intervalId = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     }
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isStarted, timeLeft]);

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const runCode = async () => {
//     if (!editorRef.current) return;
//     setIsRunning(true);
//     try {
//       const sourceCode = editorRef.current.getValue();
//       const currentProblem = selectedProblems[currentProblemIndex];
//       setOutput([
//         'Running test cases for: ' + currentProblem.title,
//         '',
//         'Source code:',
//         sourceCode,
//       ]);
//     } catch (error) {
//       setOutput(['Error running code:', error.message]);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const navigateProblems = (direction: 'prev' | 'next') => {
//     if (direction === 'prev' && currentProblemIndex > 0) {
//       setCurrentProblemIndex(currentProblemIndex - 1);
//     } else if (
//       direction === 'next' &&
//       currentProblemIndex < selectedProblems.length - 1
//     ) {
//       setCurrentProblemIndex(currentProblemIndex + 1);
//     }
//   };

//   const currentProblem = selectedProblems[currentProblemIndex];

//   return (
//     <div className="h-screen flex flex-col">
//       <AlertDialog open={showModal}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Welcome to Coding Assessment</AlertDialogTitle>
//             <AlertDialogDescription>
//               You will be presented with 3 random problems to solve. You have 45
//               minutes to complete all problems. You can navigate between
//               problems at any time. Good luck!
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={startAssessment}>
//               Start Assessment
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {isStarted && currentProblem && (
//         <div className="flex flex-col h-full">
//           {/* Top Navigation Bar */}
//           <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <h1 className="text-xl font-semibold">
//                 Problem {currentProblemIndex + 1}/3: {currentProblem.title}
//               </h1>
//               <span
//                 className={`px-2 py-1 text-sm rounded ${
//                   currentProblem.difficulty === 'Easy'
//                     ? 'bg-green-600'
//                     : currentProblem.difficulty === 'Medium'
//                     ? 'bg-yellow-600'
//                     : 'bg-red-600'
//                 }`}
//               >
//                 {currentProblem.difficulty}
//               </span>
//             </div>
//             <div className="flex items-center gap-4">
//               <Timer className="w-5 h-5" />
//               <span className="font-mono">{formatTime(timeLeft)}</span>
//             </div>
//           </div>

//           {/* Problem Navigation */}
//           <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
//             <button
//               className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
//               onClick={() => navigateProblems('prev')}
//               disabled={currentProblemIndex === 0}
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous
//             </button>
//             <div className="flex gap-2">
//               {selectedProblems.map((_, index) => (
//                 <button
//                   key={index}
//                   className={`w-8 h-8 rounded ${
//                     index === currentProblemIndex
//                       ? 'bg-blue-500'
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                   onClick={() => setCurrentProblemIndex(index)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//             <button
//               className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
//               onClick={() => navigateProblems('next')}
//               disabled={currentProblemIndex === selectedProblems.length - 1}
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Main Content */}
//           <div className="flex flex-1 overflow-hidden">
//             {/* Left Panel - Problem Description */}
//             <div className="w-2/5 border-r border-gray-200 bg-white dark:bg-gray-900 overflow-y-auto">
//               <div className="border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex">
//                   <button
//                     className={`px-4 py-2 ${
//                       activeTab === 'description'
//                         ? 'border-b-2 border-blue-500'
//                         : ''
//                     }`}
//                     onClick={() => setActiveTab('description')}
//                   >
//                     Description
//                   </button>
//                   <button
//                     className={`px-4 py-2 ${
//                       activeTab === 'solution'
//                         ? 'border-b-2 border-blue-500'
//                         : ''
//                     }`}
//                     onClick={() => setActiveTab('solution')}
//                   >
//                     Solution
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="prose dark:prose-invert max-w-none">
//                   <p className="whitespace-pre-wrap">
//                     {currentProblem.description}
//                   </p>

//                   <h3 className="text-lg font-semibold mt-6">Examples:</h3>
//                   {currentProblem.testCases.map(testCase => (
//                     <div
//                       key={testCase.id}
//                       className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded"
//                     >
//                       <div className="font-mono">
//                         <div className="text-gray-600 dark:text-gray-400">
//                           Input: {JSON.stringify(testCase.input, null, 2)}
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400">
//                           Output: {JSON.stringify(testCase.output, null, 2)}
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400 mt-2">
//                           Explanation: {testCase.explanation}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Panel - Editor and Console */}
//             <div className="flex-1 flex flex-col">
//               {/* Language Selector and Run Button */}
//               <div className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center">
//                 <select
//                   className="px-3 py-1.5 bg-white dark:bg-gray-700 border rounded"
//                   value={language}
//                   onChange={e => setLanguage(e.target.value)}
//                 >
//                   {Object.entries(LANGUAGES).map(([key, value]) => (
//                     <option key={key} value={key}>
//                       {value}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="flex gap-2">
//                   <button
//                     className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
//                     onClick={runCode}
//                     disabled={isRunning}
//                   >
//                     Run
//                   </button>
//                   <button className="px-4 py-1.5 bg-green-700 text-white rounded hover:bg-green-800">
//                     Submit
//                   </button>
//                 </div>
//               </div>

//               {/* Editor */}
//               <div className="flex-1">
//                 <Editor
//                   height="100%"
//                   defaultLanguage={language}
//                   language={language}
//                   theme="vs-dark"
//                   value={code[currentProblem.id] || ''}
//                   onChange={value =>
//                     setCode({ ...code, [currentProblem.id]: value || '' })
//                   }
//                   onMount={handleEditorDidMount}
//                   options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     lineNumbers: 'on',
//                     formatOnType: true,
//                     formatOnPaste: true,
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>

//               {/* Console Output */}
//               <div className="h-48 bg-gray-900 text-white overflow-y-auto">
//                 <div className="flex items-center p-2 border-b border-gray-700">
//                   <span className="text-sm font-semibold">Console</span>
//                 </div>
//                 <div className="p-4 font-mono text-sm">
//                   {output.map((line, index) => (
//                     <div key={index}>{line}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeAssessment;
