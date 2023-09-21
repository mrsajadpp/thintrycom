'use client'
import Image from 'next/image';
import Link from 'next/link';

import { useSearchParams, useRouter } from 'next/navigation';
import Axios from 'axios'
import Cookies from 'js-cookie';

export default function VerifyUi() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hashedVerificationCode = searchParams.get('code');
    const userId = searchParams.get('uid');
    console.log(hashedVerificationCode)
    console.log(userId);
    const verify = async (event) => {
        event.preventDefault();
        let otpInp = document.getElementById('otp');
        let loginBtn = document.getElementById('loginBtn');
        if (otpInp.value.length >= 6) {
            try {
                let response = await Axios.get('https://api.thintry.com/auth/verify/check', { params: { otp: otpInp.value, userId } }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    // Store user data in a cookie
                    // setCookie('userData', JSON.stringify(response.data.user), 1); // Cookie will expire in 1 day

                    // Handle success, maybe redirect
                    console.log(response.data)
                    Cookies.set('user', JSON.stringify(response.data.user), { secure: true })
                    console.log(data)
                    router.push(`/profile`);
                } else {
                    loginBtn.disabled = true;
                    loginBtn.style.opacity = '0.2';
                    otpInp.classList.replace('noerror-inp', 'error-inp');
                    // Handle error case
                    console.error('Verification failed');
                }
            } catch (error) {
                loginBtn.disabled = true;
                loginBtn.style.opacity = '0.2';
                otpInp.classList.replace('noerror-inp', 'error-inp');
                console.error('Verification failed', error);
            }
        } else {
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.2';
            otpInp.classList.replace('noerror-inp', 'error-inp');
        }
    };
    function validateCode(e) {
        let otpInp = document.getElementById('otp');
        let loginBtn = document.getElementById('loginBtn');
        if (otpInp.value < 6) {
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.2';
            otpInp.classList.replace('noerror-inp', 'error-inp');
        } else {
            loginBtn.disabled = false;
            loginBtn.style.removeProperty('opacity')
            otpInp.classList.replace('error-inp', 'noerror-inp');
        }
    }
    return (
        <div className="loginForm">
            <div className="bannerArea">
                <Image src={'https://thintry.com/static/media/logo.c665fb185383ae55fbf0.png'} width={150} height={40.43} alt="Thintry a indian social media website." />
            </div>
            <div className="inputs">
                <form onSubmit={verify}>
                    <div className="input">
                        <input type="number" onChange={validateCode} className="noerror-inp" name="otp" id="otp" placeholder="Verification Code" required autoComplete="off" />
                    </div>
                    <div className="loginbtn">
                        <button type='submit' id='loginBtn' disabled style={{ opacity: '0.2' }}>Verify</button>
                    </div>
                    <div className="textarea">
                        <span>Check your email box?.</span>
                    </div>
                </form>
            </div>
        </div>
    )
}