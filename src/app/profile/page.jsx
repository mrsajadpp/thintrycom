import Image from 'next/image'

import { redirect } from 'next/navigation';
import { cookies as cookie } from 'next/headers';
import HeaderUi from '../components/header-ui/headerui';
import FooterUi from '../components/footer-ui/footerui';
import jwt from 'jsonwebtoken';

export const metadata = {
  title: 'Profile - Thintry',
  description: 'Generated by create next app',
}

export default async function Profile() {
  const cookies = await cookie();
  let userLogged = await cookies.has('user-token');
  let userData = await userLogged ? jwt.decode(cookies.get('user-token').value) : { userData: null };
  userLogged ? console.log("") : redirect('/auth/login') ;
  return (
    <main>
      <HeaderUi userData={userData.userData} />
      <FooterUi userData={userData.userData} />

    </main>
  )
}
