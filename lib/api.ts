import axios from 'axios';
import { LANGUAGE_VERSIONS } from './constants';
import type { CodeExecutionResult } from '@/types';

const API = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
});

// Add delay function here
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const executeCode = async (
  language: string,
  sourceCode: string,
  retries = 3,
): Promise<CodeExecutionResult> => {
  try {
    const response = await API.post('/execute', {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      if (retries > 0) {
        // Wait for 1 seconds before retrying
        await delay(1000);
        return executeCode(language, sourceCode, retries - 1);
      }
    }
    throw new Error('Code execution failed: ' + (error as Error).message);
  }
};
