'use client'
import Image from 'next/image';
import Link from 'next/link';
import jwt from 'jsonwebtoken';

import { useRouter } from 'next/navigation';
import Axios from 'axios';

export default function LoginUi(props) {
  const router = useRouter();
  props.userLogged ? redirect('/profile') : console.log('');

  async function onSubmit(event) {
    event.preventDefault();
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    try {
      const formData = await new FormData(event.target);
      let res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: formData.get('username'), password: formData.get('password') })
      }).then((t) => t.json());
      if (res.token) {
        router.push('/profile')
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
          <Image src={'https://thintry.com/static/media/logo.c665fb185383ae55fbf0.png'} width={150} height={40.43} alt="Thintry a indian social media website." />
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
                    Axios.get('https://api.thintry.com/username/check', { params: { username: newValue } }, {
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
