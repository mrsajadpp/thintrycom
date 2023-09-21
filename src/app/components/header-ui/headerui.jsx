'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function HeaderUi(props) {
    const userData = props.userData ? JSON.parse(props.userData) : false;
    const pathname = usePathname();

    const isPageActive = (path) => {
        return pathname === path;
    };
    return (
        <div className="header">
            <div className="hleft">
                <Link href="/">
                    <Image src={'https://thintry.com/static/media/logo.c665fb185383ae55fbf0.png'} width={100} height={26.95} alt="Thintry a indian social media website." />
                </Link>
            </div>
            <div className="hright">
                <nav>
                    <Link href="/" className='deskmenu'>
                        <button>
                            {isPageActive('/') ? (
                                <svg aria-label="Home" class="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>
                            ) : (
                                <svg aria-label="Home" class="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                            )}
                        </button>
                    </Link>
                    <Link href="/search" id='searchBtn'>
                        <button>
                            {isPageActive('/search') ? (
                                <svg aria-label="Explore" class="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line></svg>
                            ) : (
                                <svg aria-label="Explore" class="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                            )}
                        </button>
                    </Link>
                    <Link href="/messages" className='deskmenu'>
                        <button>
                            {isPageActive('/messages') ? (
                                <svg aria-label="Messenger" class="_ab6-" color="#6fbf7e" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path><path d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z" ></path></svg>
                            ) : (
                                <svg aria-label="Messenger" class="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path><path d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z" fill-rule="evenodd"></path></svg>
                            )}
                        </button>
                    </Link>
                    <Link href="/notifications" className='deskmenu'>
                        <button>
                            {isPageActive('/notifications') ? (
                                <svg aria-label="Notifications" class="x1lliihq x1n2onr6" color="#6fbf7e" fill="#6fbf7e" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path></svg>
                            ) : (
                                <svg aria-label="Notifications" class="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                            )}
                        </button>
                    </Link>
                    <Link href="/profile" className='deskmenu'>
                        <button>
                            {userData ? (
                                <>
                                    {isPageActive('/profile') ? (
                                        <div className='active profile' >
                                            <Image src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile} width={28} height={28} alt="Thintry a indian social media website." />
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
                                            <Image src={'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'} width={28} height={28} alt="Thintry a indian social media website." />
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
                </nav>
            </div>
            <div className="newBtn">
                <Link href="/tag/new" id="postPlusBtn" className='deskmenu'>
                    <button className='roundedPost'>
                        <svg fill='#fff' width="30px" height="30px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -960 960 960" style={{ enableBackground: 'new 0 0 100 100' }}><path d="M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" /></svg>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default HeaderUi
