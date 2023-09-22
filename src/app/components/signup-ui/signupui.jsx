'use client'
import Image from 'next/image';
import Link from 'next/link';
import jwt from 'jsonwebtoken';

import { redirect, useRouter } from 'next/navigation';
import Axios from 'axios'

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

export default function SignupUi() {
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault();
        let firstname = document.getElementById('firstname');
        let loginBtn = document.getElementById('loginBtn');
        let lastname = document.getElementById('lastname');
        let username = document.getElementById('username');
        let email = document.getElementById('email');
        let password = document.getElementById('password');

        const form = event.target;
        const formData = new FormData(form);

        try {
            // let response = await Axios.get('https://api.thintry.com/auth/signup', { params:  }, {
            //     headers: {
            //         'Access-Control-Allow-Origin': true,
            //     }
            // })

            let res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname: formData.get('firstname'), lastname: formData.get('lastname'), username: formData.get('username'), password: formData.get('password'), email: formData.get('email') })
            }).then((t) => t.json());

            if (res.token) {
                // Handle success, maybe redirect
                let userData = await jwt.decode(res.token);
                const verificationCode = userData.userData.encrypted_verification_code; // Assuming your response includes the verification code
                router.push(`/auth/verify?code=${verificationCode}&uid=${userData.userData._id}`);
            } else {
                loginBtn.disabled = true;
                loginBtn.style.opacity = '0.2';
                firstname.classList.replace('noerror-inp', 'error-inp');
                lastname.classList.replace('noerror-inp', 'error-inp');
                username.classList.replace('noerror-inp', 'error-inp');
                email.classList.replace('noerror-inp', 'error-inp');
                password.classList.replace('noerror-inp', 'error-inp');
                // Handle error case
                console.error('Signup failed');
            }
        } catch (error) {
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.2';
            firstname.classList.replace('noerror-inp', 'error-inp');
            lastname.classList.replace('noerror-inp', 'error-inp');
            username.classList.replace('noerror-inp', 'error-inp');
            email.classList.replace('noerror-inp', 'error-inp');
            password.classList.replace('noerror-inp', 'error-inp');
            console.error('Signup failed', error);
        }
    };
    return (
        <div className="loginForm">
            <div className="bannerArea">
                <Image src={'https://thintry.com/static/media/logo.c665fb185383ae55fbf0.png'} width={150} height={40.43} alt="Thintry a indian social media website." />
            </div>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <div className="name">
                        <div className="input">
                            <input type="text" className="noerror-inp" id="firstname" name="firstname" placeholder="First Name"
                                required autoComplete="off" onChange={() => {
                                    let firstname = document.getElementById('firstname');
                                    let loginBtn = document.getElementById('loginBtn');
                                    if (firstname.value.length <= 0) {
                                        loginBtn.disabled = true;
                                        loginBtn.style.opacity = '0.2';
                                        firstname.classList.replace('noerror-inp', 'error-inp'); // Corrected line
                                    } else {
                                        loginBtn.disabled = false;
                                        loginBtn.style.removeProperty('opacity')
                                        firstname.classList.replace('error-inp', 'noerror-inp');
                                    }
                                }} />
                            <span id="firstnameError" className="error"></span>
                        </div>&nbsp;
                        <div className="input">
                            <input className="noerror-inp" type="text" id="lastname" name="lastname" placeholder="Last Name"
                                required autoComplete="off" onChange={() => {
                                    let lastname = document.getElementById('lastname');
                                    let loginBtn = document.getElementById('loginBtn');
                                    if (lastname.value.length <= 0) {
                                        loginBtn.disabled = true;
                                        loginBtn.style.opacity = '0.2';
                                        lastname.classList.replace('noerror-inp', 'error-inp'); // Corrected line
                                    } else {
                                        loginBtn.disabled = false;
                                        loginBtn.style.removeProperty('opacity')
                                        lastname.classList.replace('error-inp', 'noerror-inp');
                                    }
                                }} />
                            <span id="lastnameError" className="error"></span>
                        </div>
                    </div>
                    <div className="input">
                        <input type="text" className="noerror-inp" id="username" name="username" placeholder="Username" required autoComplete="off" onChange={(event) => {
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
                                                loginBtn.disabled = true;
                                                loginBtn.style.opacity = '0.2';
                                                username.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                loginBtn.disabled = false;
                                                loginBtn.style.removeProperty('opacity')
                                                username.classList.replace('error-inp', 'noerror-inp');
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
                        <input type="email" className="noerror-inp" id="email" name="email" placeholder="Email" required autoComplete="off" onChange={(event) => {
                            let email = document.getElementById('email');
                            let loginBtn = document.getElementById('loginBtn');
                            const newValue = event.target.value.trim(); // Remove leading and trailing spaces
                            email.value = newValue;

                            if (newValue.length <= 0) {
                                loginBtn.disabled = true;
                                loginBtn.style.opacity = '0.2';
                                email.classList.replace('noerror-inp', 'error-inp');
                            } else if (!isValidEmail(newValue)) {
                                loginBtn.disabled = true;
                                loginBtn.style.opacity = '0.2';
                                email.classList.replace('noerror-inp', 'error-inp');
                            } else {
                                loginBtn.disabled = false;
                                loginBtn.style.removeProperty('opacity')
                                email.classList.replace('error-inp', 'noerror-inp');
                            }
                        }} />
                        <span id="emailError" className="error"></span>
                    </div>
                    <div className="input">
                        <input type="password" className="noerror-inp" name="password" id="password" placeholder="Password" required autoComplete="off" onChange={(event) => {
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
                        <button type='submit' id='loginBtn' disabled style={{ opacity: '0.2' }}>SignUp</button>
                    </div>
                    <div className="textarea">
                        <span>Already have an account? , <Link href="/auth/login">LogIn</Link>.</span>
                    </div>
                </form>
            </div>
        </div>
    )
}