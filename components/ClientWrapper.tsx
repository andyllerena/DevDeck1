'use client';
import HeaderBox from './HeaderBox';
import ProblemsList from './ProblemList';
import ProgressBox from './ProgressBox';
import { ProgressProvider } from './ProgressContent';
import RightSideBar from './RightSideBar';
import type { Category, User } from '@/types';

interface ClientWrapperProps {
  loggedIn: User | null;
  categories: Category[];
}

const ClientWrapper = ({ loggedIn, categories }: ClientWrapperProps) => {
  return (
    <ProgressProvider categories={categories}>
      <section className="home">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedIn?.firstName || 'Guest'}
              subtext="Your journey to mastery starts here."
            />
            <ProgressBox />
          </header>
          <ProblemsList categories={categories} />
        </div>
        <RightSideBar user={loggedIn} transactions={[]} banks={[]} />
      </section>
    </ProgressProvider>
  );
};

export default ClientWrapper;
