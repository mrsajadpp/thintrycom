'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function FooterUi(props) {
    const userData = props.userData ? props.userData : false;
    const pathname = usePathname();

    const isPageActive = (path) => {
        return pathname === path;
    };
    return (
        <div className="footer" id="footer">
            <div className="icons">
                <nav>
                    <Link href={'/'}>
                        <button>
                            {isPageActive('/') ? (
                                <svg aria-label="Home" className="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>
                            ) : (
                                <svg aria-label="Home" className="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                            )}
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/messages">
                        <button>
                            {isPageActive('/messages') ? (
                                <svg aria-label="Messenger" className="_ab6-" color="#6fbf7e" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path></svg>
                            ) : (
                                <svg aria-label="Messenger" className="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path></svg>
                            )}
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/tag/new">
                        <button>
                        <svg aria-label="Home" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/notifications">
                        <button>
                            {isPageActive('/notifications') ? (
                                <svg aria-label="Notifications" className="x1lliihq x1n2onr6" color="#6fbf7e" fill="#6fbf7e" height="24" role="img" viewBox="0 0 24 24" width="24"><path fill='#6fbf7e' d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path></svg>
                            ) : (
                                <svg aria-label="Notifications" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                            )}
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/profile" className='footmenu'>
                        <button>
                            {userData ? (
                                <>
                                    {isPageActive('/profile') ? (
                                        <div className='active profile' >
                                            <Image src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile} width={28} height={28} alt="Thintry a indian social media website." />
                                        </div>
                                    ) : (
                                        <div className='profile'>
                                            <Image src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile} width={28} height={28} alt="Thintry a indian social media website." />
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
                                            <Image src={'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'} width={28} height={28} alt="Thintry a indian social media website." />
                                        </div>
                                    )}
                                </>
                            )}
                        </button>
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default FooterUi
