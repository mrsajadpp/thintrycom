'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function FooterUi() {
    const pathname = usePathname();

    const isPageActive = (path) => {
        
        return pathname === path;
    };
    return (
        <div className="footer" id="footer">
            <div className="icons">
                <nav>
                    <Link href="/">
                        <button>
                            <box-icon type="solid" name='home' color={isPageActive('/') ? '#6fbf7e' : '#fff'}></box-icon>
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/messages">
                        <button>
                            <box-icon type="solid" name='message-square-dots' color={isPageActive('/messages') ? '#6fbf7e' : '#fff'}></box-icon>
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/tag/new">
                        <button>
                            <box-icon name='plus' color={isPageActive('/tag/new') ? '#6fbf7e' : '#fff'}></box-icon>
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/notifications">
                        <button>
                            <box-icon type='solid' name='bell' color={isPageActive('/notifications') ? '#6fbf7e' : '#fff'}></box-icon>
                        </button>
                    </Link>
                </nav>
            </div>
            <div className="icons">
                <nav>
                    <Link href="/profile">
                        <button>
                            <box-icon name='user' color={isPageActive('/profile') ? '#6fbf7e' : '#fff'}></box-icon>
                        </button>
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default FooterUi
