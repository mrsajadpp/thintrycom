'use client'
import Image from 'next/image';
import Link from 'next/link';
import { checkAuthentication } from '../../../api/auth';
import { useRouter } from 'next/navigation';
import Axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginUi() {
  const router = useRouter();
  let isAuthenticated = checkAuthentication('/auth/login');
  isAuthenticated ? '' : redirect('/profile');

  async function onSubmit(event) {
    event.preventDefault();
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    try {
      const formData = await new FormData(event.target);
      let response = await Axios.get('http://localhost:3002/auth/login', { params: { username: formData.get('username'), password: formData.get('password') } })

      if (response.data.status) {
        
        console.log(response.data)
        Cookies.set('user', JSON.stringify(response.data.user), { secure: true })
        router.push('/profile')
      } else {
        username.classList.replace('noerror-inp', 'error-inp');
        password.classList.replace('noerror-inp', 'error-inp');
      }
    } catch (error) {
      console.error('Loginfailed', error);
      username.classList.replace('noerror-inp', 'error-inp');
      password.classList.replace('noerror-inp', 'error-inp');
    }
  }

  return (
    <div>
      <div className="loginForm">
        <div className="bannerArea">
          <Image src={'https://thintry.com/static/media/logo.c665fb185383ae55fbf0.png'} alt="" />
        </div>
        <div className="inputs">
          <form onSubmit={onSubmit}>
            <div className="input">
              <input type="text" className="noerror-inp" id="username" name="username" placeholder="Username" required
                autoComplete='off' onChange={(event) => {
                  let username = document.getElementById('username');
                  let loginBtn = document.getElementById('loginBtn');
                  const newValue = event.target.value.replace(/ /g, '').toLowerCase(); // Remove spaces and convert to lowercase
                  username.value = newValue;

                  if (newValue.length <= 0) {
                    username.classList.replace('noerror-inp', 'error-inp');
                  } else {
                    Axios.get('http://localhost:3002/username/check', { params: { username: newValue } }, {
                      headers: {
                        'Access-Control-Allow-Origin': true,
                      }
                    })
                      .then((response) => {
                        if (response.data) {
                          if (response.data.usernameExist) {
                            loginBtn.disabled = false;
                            loginBtn.style.removeProperty('opacity')
                            username.classList.replace('error-inp', 'noerror-inp');
                          } else {
                            loginBtn.disabled = true;
                            loginBtn.style.opacity = '0.2';
                            username.classList.replace('noerror-inp', 'error-inp');
                          }
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                }} />
              <span id="usernameError" className="error"></span>
            </div>
            <div className="input">
              <input type="password" className="noerror-inp" id="password" name="password" placeholder="Password" required
                autoComplete="off" onChange={(event) => {
                  let password = document.getElementById('password');
                  let loginBtn = document.getElementById('loginBtn');
                  const newValue = event.target.value;

                  const hasCapitalLetter = /[A-Z]/.test(newValue);
                  const hasCharacter = /[a-zA-Z]/.test(newValue);

                  if (newValue.length < 8 || !hasCapitalLetter || !hasCharacter) {
                    loginBtn.disabled = true;
                    loginBtn.style.opacity = '0.2';
                    password.classList.replace('noerror-inp', 'error-inp');
                  } else {
                    loginBtn.disabled = false;
                    loginBtn.style.removeProperty('opacity')
                    password.classList.replace('error-inp', 'noerror-inp');
                  }
                }} />
              <span id="passwordError" className="error"></span>
            </div>
            <div className="loginbtn">
              <button id='loginBtn' disabled style={{ opacity: '0.2' }}>LogIn</button>
            </div>
            <div className="textarea">
              <span>Don't have an account? , <Link href="/auth/signup">SignUp</Link>.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
