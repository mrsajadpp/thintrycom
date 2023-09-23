import { cookies as cookie } from 'next/headers';
import HeaderUi from './components/header-ui/headerui';
import FooterUi from './components/footer-ui/footerui';
import Tag from './components/tag-ui/tagui';
import Axios from 'axios';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import jwt from 'jsonwebtoken';

export default async function Home() {
  const cookies = await cookie();
  let userLogged = await cookies.has('user-token');
  let userData = await userLogged ? jwt.decode(cookies.get('user-token').value) : { userData: null };

  async function fetchTags() {
    try {
      const response = await Axios.get('https://api.thintry.com/fetch/user/tags/all');

      if (response.data.status) {
        // Store tags in localStorage
        // localStorage.setItem('userTags', JSON.stringify(response.data.tags));
        return response.data.tags;
      }
    } catch (error) {
      console.error('Fetching failed', error);
    }
  }

  const tags = await fetchTags();


  return (
    <main>
      <HeaderUi userData={userData.userData} />
      <FooterUi userData={userData.userData} />
      <div id="page">
        {tags ? (
          <>
            {tags.map((tag) => (
              <Tag key={tag._id} tag={tag} userData={userData.userData} />
            ))}
            <>
              <div style={{ marginBottom: '60px' }}></div>
            </>
          </>
        ) : (
          <SkeletonTheme baseColor="#0f0f0f" highlightColor="#0e0e0e">
            <div className="tweet">
              <div className="tweet-container pt pb pr pl">
                {/* User */}
                <div className="user pr">
                  <div className="userl" >
                    <div className="profile">
                      <Skeleton width={50} height={50} />
                    </div>
                    <div className="username">
                      <div className="name">
                        <Skeleton width={100} />
                      </div>

                      <div className="handle">
                        <Skeleton width={80} />
                      </div>

                    </div>
                  </div>
                  <div className="userr">
                    <Skeleton width={100} height={40} />
                  </div>
                </div>

                {/* Tweet content */}
                <div className="tweet-content pt">
                  <Skeleton width={'100%'} height={100} />
                </div>

                {/* Date and location */}
                <div className="date pt pb">
                  <>
                    <Skeleton width={100} />
                    <Skeleton width={100} />
                  </>
                </div>


                {/* Upvotes and Downvotes */}
                <div className="rl pt pb">
                  <div className="skeleton-loader" style={{ display: 'flex' }}>
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                    {' '}
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="icons">
                <div className="ico">
                  <span><Skeleton width={30} height={30} /></span>
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
              </div>
            </div>
            <div className="tweet">
              <div className="tweet-container pt pb pr pl">
                {/* User */}
                <div className="user pr">
                  <div className="userl" >
                    <div className="profile">
                      <Skeleton width={50} height={50} />
                    </div>
                    <div className="username">
                      <div className="name">
                        <Skeleton width={100} />
                      </div>

                      <div className="handle">
                        <Skeleton width={80} />
                      </div>

                    </div>
                  </div>
                  <div className="userr">
                    <Skeleton width={100} height={40} />
                  </div>
                </div>

                {/* Tweet content */}
                <div className="tweet-content pt">
                  <Skeleton width={'100%'} height={100} />
                </div>

                {/* Date and location */}
                <div className="date pt pb">
                  <>
                    <Skeleton width={100} />
                    <Skeleton width={100} />
                  </>
                </div>


                {/* Upvotes and Downvotes */}
                <div className="rl pt pb">
                  <div className="skeleton-loader" style={{ display: 'flex' }}>
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                    {' '}
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="icons">
                <div className="ico">
                  <span><Skeleton width={30} height={30} /></span>
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
              </div>
            </div>
            <div className="tweet">
              <div className="tweet-container pt pb pr pl">
                {/* User */}
                <div className="user pr">
                  <div className="userl" >
                    <div className="profile">
                      <Skeleton width={50} height={50} />
                    </div>
                    <div className="username">
                      <div className="name">
                        <Skeleton width={100} />
                      </div>

                      <div className="handle">
                        <Skeleton width={80} />
                      </div>

                    </div>
                  </div>
                  <div className="userr">
                    <Skeleton width={100} height={40} />
                  </div>
                </div>

                {/* Tweet content */}
                <div className="tweet-content pt">
                  <Skeleton width={'100%'} height={100} />
                </div>

                {/* Date and location */}
                <div className="date pt pb">
                  <>
                    <Skeleton width={100} />
                    <Skeleton width={100} />
                  </>
                </div>


                {/* Upvotes and Downvotes */}
                <div className="rl pt pb">
                  <div className="skeleton-loader" style={{ display: 'flex' }}>
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                    {' '}
                    <div>
                      <b>
                        <Skeleton width={50} />
                      </b>{' '}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="icons">
                <div className="ico">
                  <span><Skeleton width={30} height={30} /></span>
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
              </div>
            </div>
          </SkeletonTheme>
        )}
      </div>
    </main>
  )
}
