import Image from 'next/image';
import Link from 'next/link';

import { redirect } from 'next/navigation';
import LoginUi from '@/app/components/login-ui/loginui';
import { cookies as cookie } from 'next/headers';

export const metadata = {
  title: 'Login - Thintry',
  description: 'Generated by create next app',
}

export default async function Login() {
  const cookies = cookie();
  let userLogged  = await cookies.has('user');
  console.log(userLogged)
  userLogged ? redirect('/profile') : console.log("Please login.") ;

  console.log(userLogged);

  return (
    <div>
      <LoginUi userLogged={userLogged} cookies={cookies} />
    </div>
  )
}
