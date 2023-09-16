import Image from 'next/image'
import { checkAuthentication } from '../../api/auth';
import { redirect } from 'next/navigation';
import HeaderUi from '../components/header-ui/headerui';
import FooterUi from '../components/footer-ui/footerui';

export const metadata = {
  title: 'About - Thintry',
  description: 'Generated by create next app',
}

export default async function User() {
  let isAuthenticated = await checkAuthentication('/user');
  isAuthenticated ? '' : redirect('/auth/login');
  return (
    <main>
      <HeaderUi />
      <FooterUi />
    </main>
  )
}
