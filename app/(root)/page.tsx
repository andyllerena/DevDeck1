// app/(root)/page.tsx
import HeaderBox from '@/components/HeaderBox';
import ProblemsList from '@/components/ProblemList';
import ProgressBox from '@/components/ProgressBox';
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import questions from '../../questions.json';
import ClientWrapper from '@/components/ClientWrapper';

// This is a server component
export default async function Page() {
  const loggedIn = await getLoggedInUser();
  const categories = questions;

  return <ClientWrapper loggedIn={loggedIn} categories={categories} />;
}
