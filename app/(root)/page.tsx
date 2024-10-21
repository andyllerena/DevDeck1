import HeaderBox from '@/components/HeaderBox';
import ProgressBox from '@/components/ProgressBox';
import RightSideBar from '@/components/RightSideBar';
// import RecentTransactions from '@/components/RecentTransactions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Your journey to mastery starts here."
          />
          <ProgressBox
            totalProblems={75}
            completedProblems={40} // Example value, can be dynamic
            progressPercentage={(36 / 75) * 100} // Calculate percentage dynamically
          />
        </header>
        RECENT HISTORY
      </div>

      <RightSideBar user={loggedIn} transactions={[]} banks={[]} />
    </section>
  );
};

export default Home;
