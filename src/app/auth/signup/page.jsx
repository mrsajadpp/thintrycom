import Image from 'next/image';
import Link from 'next/link';
import { checkAuthentication } from '../../../api/auth';
import { redirect } from 'next/navigation';
import SignupUi from '@/app/components/signup-ui/signupui';
import { cookies as cookie } from 'next/headers';

export const metadata = {
  title: 'Signup - Thintry',
  description: 'Generated by create next app',
}

export default async function Login() {
  const cookies = cookie();
  let userLogged  = await cookies.has('user');
  let isAuthenticated = await checkAuthentication('/auth/login', userLogged);
  isAuthenticated ? '' : redirect('/profile');

  return (
    <div>
      <SignupUi />
    </div>
  )
}