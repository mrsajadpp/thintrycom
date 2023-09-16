import Image from 'next/image';
import Link from 'next/link';
import { checkAuthentication } from '../api/auth';
import { redirect } from 'next/navigation';
import { cookies as cookie } from 'next/headers';

export default async function Home() {
  const cookies = cookie();
  let userLogged = await cookies.has('user');
  let isAuthenticated = await checkAuthentication('/');
  isAuthenticated ? '' : redirect('/auth/login');
  return (
    <main className="page">
    </main>
  )
}
