'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function HeaderUi() {
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
                        <buthrefn>
                            <box-icon type="solid" name='home' color={isPageActive('/') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                    <Link href="/search" id='searchBtn'>
                        <buthrefn>
                            <box-icon name='search' color={isPageActive('/search') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                    <Link href="/messages" className='deskmenu'>
                        <buthrefn>
                            <box-icon type="solid" name='message-square-dots' color={isPageActive('/messages') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                    <Link href="/notifications" className='deskmenu'>
                        <buthrefn>
                            <box-icon name='bell' type='solid' color={isPageActive('/notifications') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                    <Link href="/profile" className='deskmenu'>
                        <buthrefn>
                            <box-icon name='user' color={isPageActive('/profile') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                    <Link href="/tag/new" id="postPlusBtn" className='deskmenu'>
                        <buthrefn>
                            <box-icon name='plus' color={isPageActive('/tag/new') ? '#6fbf7e' : '#fff'}></box-icon>
                        </buthrefn>
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default HeaderUi
