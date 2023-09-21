import Image from 'next/image';
import Link from 'next/link';

import { redirect } from 'next/navigation';
import VerifyUi from '@/app/components/verify-ui/verifyui';
import { cookies as cookie } from 'next/headers';

export const metadata = {
  title: 'Verify - Thintry',
  description: 'Generated by create next app',
}

export default async function Verify() {
    const cookies = cookie();
  let userLogged  = await cookies.has('user');
  let isAuthenticated = await checkAuthentication('/auth/verify', userLogged);
  isAuthenticated ? '' : redirect('/profile');

  return (
    <div>
      <VerifyUi />
    </div>
  )
}
