import { cookies as cookie } from 'next/headers';
import HeaderUi from './components/header-ui/headerui';
import FooterUi from './components/footer-ui/footerui';
import Tag from './components/tag-ui/tagui';
import Axios from 'axios';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default async function Home() {
  const cookies = cookie();
  let userLogged = await cookies.has('user');
  let userData = await userLogged ? JSON.parse(cookies.get('user').value) : false;

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
      <HeaderUi userData={userData.value} />
      <div id="page">
        {tags ? (
          <>
            {tags.map((tag) => (
              <Tag key={tag._id} tag={tag} userData={userData} />
            ))}
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
                  {/* <div className="number">
                            <span id={`up-count-${props.tag._id}`} className="up-count">
                                {formatNumber(props.tag.upvote ? props.tag.upvote.length : '0')}
                            </span>
                        </div> */}
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>

                {/* <div className="ico">
                        <span
                            id={`dow-${props.tag._id}`}
                            onClick={() => {
                                handleDownvote(props.tag._id);
                            }}
                        >
                            <box-icon
                                type="solid"
                                name="down-arrow"
                                color={props.userData && props.tag.downvote.includes(props.userData._id) ? "#6fbf7e" : "#fff"}
                                className="img"
                            />
                        </span>
                        <div className="number">
                            <span id={`dow-count-${props.tag._id}`} className="down-count">
                                {formatNumber(props.tag.downvote ? props.tag.downvote.length : '')}
                            </span>
                        </div>
                    </div> */}
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
                  {/* <div className="number">
                            <span id={`up-count-${props.tag._id}`} className="up-count">
                                {formatNumber(props.tag.upvote ? props.tag.upvote.length : '0')}
                            </span>
                        </div> */}
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>

                {/* <div className="ico">
                        <span
                            id={`dow-${props.tag._id}`}
                            onClick={() => {
                                handleDownvote(props.tag._id);
                            }}
                        >
                            <box-icon
                                type="solid"
                                name="down-arrow"
                                color={props.userData && props.tag.downvote.includes(props.userData._id) ? "#6fbf7e" : "#fff"}
                                className="img"
                            />
                        </span>
                        <div className="number">
                            <span id={`dow-count-${props.tag._id}`} className="down-count">
                                {formatNumber(props.tag.downvote ? props.tag.downvote.length : '')}
                            </span>
                        </div>
                    </div> */}
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
                  {/* <div className="number">
                            <span id={`up-count-${props.tag._id}`} className="up-count">
                                {formatNumber(props.tag.upvote ? props.tag.upvote.length : '0')}
                            </span>
                        </div> */}
                </div>

                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>

                {/* <div className="ico">
                        <span
                            id={`dow-${props.tag._id}`}
                            onClick={() => {
                                handleDownvote(props.tag._id);
                            }}
                        >
                            <box-icon
                                type="solid"
                                name="down-arrow"
                                color={props.userData && props.tag.downvote.includes(props.userData._id) ? "#6fbf7e" : "#fff"}
                                className="img"
                            />
                        </span>
                        <div className="number">
                            <span id={`dow-count-${props.tag._id}`} className="down-count">
                                {formatNumber(props.tag.downvote ? props.tag.downvote.length : '')}
                            </span>
                        </div>
                    </div> */}
                <div className="ico">
                  <Skeleton width={30} height={30} />
                </div>
              </div>
            </div>
          </SkeletonTheme>
        )}
      </div>
      <FooterUi userData={userData.value} />
    </main>
  )
}
