'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function MenuUi(props) {
    const userData = props.userData ? JSON.parse(props.userData) : false;
    const pathname = usePathname();

    const isPageActive = (path) => {
        return pathname === path;
    };
    return (
        <div className="menuBar">
            <div className="logo-bar">
                <Link href="/">
                    <Image src={'https://i.postimg.cc/vB5rhV64/thintryhashlogo.png'} width={40} height={40} alt="Thintry a indian social media website." />
                </Link>
            </div>
            <div className="menu-nav">
                <div className="nav">
                    <Link href={'/'}>
                        <button>
                            {isPageActive('/') ? (
                                <svg fill='#6fbf7e' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" /></svg>
                            ) : (
                                <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                            )}
                        </button>
                    </Link>
                </div>
                <div className="nav">
                    <Link href="/search">
                        <button>
                            {isPageActive('/search') ? (
                                <svg fill='#6fbf7e' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                            ) : (
                                <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                            )}
                        </button>
                    </Link>
                </div>
                <div className="nav">
                    <Link href="/messages">
                        <button>
                            {isPageActive('/messages') ? (
                                <svg fill='#6fbf7e' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm160-320h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Z" /></svg>
                            ) : (
                                <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" /></svg>
                            )}
                        </button>
                    </Link>
                </div>
                <div className="nav">
                    <Link href="/notifications">
                        <button>
                            {isPageActive('/notifications') ? (
                                <svg fill='#6fbf7e' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z" /></svg>
                            ) : (
                                <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>
                            )}
                        </button>
                    </Link>
                </div>
                <div className="nav">
                    <Link href="/profile" className='deskmenu'>
                        <button>
                            {userData ? (
                                <>
                                    {isPageActive('/profile') ? (
                                        <div className='active profile' >
                                            <Image src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile} width={30} height={30} alt="Thintry a indian social media website." />
                                        </div>
                                    ) : (
                                        <div className='profile'>
                                            <Image src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile} width={30} height={30} alt="Thintry a indian social media website." />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {isPageActive('/profile') ? (
                                        <div className='active profile' >
                                            <Image src={'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'} width={30} height={30} alt="Thintry a indian social media website." />
                                        </div>
                                    ) : (
                                        <div className='profile'>
                                            <Image src={'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'} width={30} height={30} alt="Thintry a indian social media website." />
                                        </div>
                                    )}
                                </>
                            )}
                        </button>
                    </Link>
                </div>
            </div>
            <div className="new-nav">
                <div className="nav">
                    <Link href="/tag/new">
                        <button className='roundedPost'>
                            <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" /></svg>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MenuUi
