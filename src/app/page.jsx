import Image from 'next/image';
import Link from 'next/link';
import { checkAuthentication } from '../api/auth';
import { redirect } from 'next/navigation';
import { cookies as cookie } from 'next/headers';
import HeaderUi from './components/header-ui/headerui';
import FooterUi from './components/footer-ui/footerui';
import Tag from './components/tag-ui/tagui';
import { Axios } from 'axios';

export default async function Home() {
  const cookies = cookie();
  let userLogged = await cookies.has('user');
  let userData = await cookies.get('user') ? cookies.get('user') : false;

  async function fetchTags(uid) {
    try {
      const response = await Axios.get('https://api.thintry.com/fetch/user/tags', {
        params: { uid },
      });

      if (response.data.status) {
        // Store tags in localStorage
        // localStorage.setItem('userTags', JSON.stringify(response.data.tags));
        setTags(response.data.tags);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Fetching failed', error);
    }
  }


  return (
    <main>
      <HeaderUi userData={userData.value} />
      {/* <Tag userData={userData} /> */}
      <FooterUi userData={userData.value} />
    </main>
  )
}
