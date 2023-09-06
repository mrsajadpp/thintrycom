import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import './User.css'
import About from '../../components/About/About';
import Tag from '../../components/Tag/Tag';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function User(props) {
  const { username } = useParams();
  const navigate = useNavigate();

  let [userData, setData] = useState({});
  let [profileData, setProfile] = useState({});
  const [isFollowing, setIsFollowing] = useState();
  const [isFollowingBack, setIsFollowingBack] = useState();

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
  }

  function getUserDataFromCookie() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='));

    if (cookieValue) {
      const valuePair = cookieValue.split('=');
      if (valuePair.length === 2) {
        return JSON.parse(decodeURIComponent(valuePair[1]));
      }
    }
    return null;
  }

  function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  // delete_cookie('userData')

  useEffect(() => {
    // Check if the user is already logged in using the cookie
    let userData = getUserDataFromCookie();
    if (!userData) {
      navigate("/auth/login");
      return; // No need to continue checking if already logged in
    }
  }, [navigate]);

  useEffect(() => {
    // Default title
    const defaultTitle = `${profileData ? profileData.firstname : 'loading'} ${profileData ? profileData.lastname : 'loading'} @${profileData ? profileData.username : 'loading'}`;
    const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
    document.title = updatedTitle;

    // Default meta description and keywords
    const metaDescription = profileData.about;
    const metaKeywords = props.keywords ? `${props.keywords}, microblog, Thintry, social media` : "microblog, Thintry, social media," + (profileData ? (`${profileData.username}, ${profileData.firstname}, ${profileData.lastname},`) : ('loading'));

    // Update meta description tag
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.content = metaDescription;
    }

    // Update meta keywords tag
    const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) {
      metaKeywordsTag.content = metaKeywords;
    }
  }, [profileData, props.title, props.description, props.keywords]);
  const location = useLocation();

  let [posts, setPost] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserDataFromCookie();
        setData(userData)
        let response = await Axios.get('https://api.thintry.com/fetch/user', { params: { username: userData.username } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setCookie('userData', JSON.stringify(response.data.user), 1);
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        let response = await Axios.get('https://api.thintry.com/fetch/user', { params: { username: username } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          // setCookie('userData', JSON.stringify(response.data.user), 1);
          setProfile(response.data.user);
          if (response.data.user.username == userData.username) {
            navigate('/profile');
          }
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchProfileData();
  }, [userData, isFollowing]);

  useEffect(() => {
    async function fetchPost() {
      try {
        let response = await Axios.get('https://api.thintry.com/fetch/user/posts', { params: { uid: profileData._id } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setPost(response.data.posts)
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchPost();
  }, []);

  function pageType() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type');
    return type;
  }

  useEffect(() => {
    async function isFollowing() {
      // /user/isfollowing
      try {
        let response = await Axios.post('https://api.thintry.com/user/isfollowing', { follower_id: userData._id, following_id: profileData._id }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          console.log(response.data)
          setIsFollowing(response.data.following)
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    isFollowing();
  }, [profileData]);

  useEffect(() => {
    async function isFollowingBackFn() {
      // /user/isfollowing
      try {
        let response = await Axios.post('https://api.thintry.com/user/isfollowing', { follower_id: profileData._id, following_id: userData._id }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setIsFollowingBack(response.data.following)
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    isFollowingBackFn();
  }, [profileData]);

  const unfollow = async () => {
    try {
      let response = await Axios.post('https://api.thintry.com/user/unfollow', { follower_id: userData._id, following_id: profileData._id }, {
        headers: {
          'Access-Control-Allow-Origin': true,
        }
      });

      if (response.data.status) {
        setIsFollowing(false)
      }
    } catch (error) {
      console.error('Fetching failed', error);
    }
  }

  const follow = async (e) => {
    try {
      let response = await Axios.post('https://api.thintry.com/user/follow', { follower_id: userData._id, following_id: profileData._id }, {
        headers: {
          'Access-Control-Allow-Origin': true,
        }
      });

      if (response.data.status) {
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Fetching failed', error);
    }
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="dp">
            <SkeletonTheme baseColor="#0f0f0f" highlightColor="#0e0e0e">
              <div className="dp-ring">
                {!profileData.profile ? (
                  // Skeleton loader for the user profile image
                  <Skeleton width={100} height={100} />
                ) : (
                  // Actual content when not loading
                  profileData.profile && profileData.profile ? (
                    <img
                      src={profileData.profile.startsWith('/') ? 'https://api.thintry.com' + profileData.profile : profileData.profile}
                      alt={profileData.firstname + ' ' + profileData.lastname}
                      onError={(event) => {
                        event.target.src = 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg';
                        event.target.onError = null;
                      }}
                    />
                  ) : (
                    <img src="https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg" alt="Default Profile" />
                  )
                )}
              </div>
            </SkeletonTheme>
            <div className="name-tag">
              <SkeletonTheme baseColor="#0f0f0f" highlightColor="#0e0e0e">
                <div className="name">
                  {profileData.firstname && profileData.lastname ? (
                    <>
                      {profileData.firstname} {profileData.lastname}
                    </>
                  ) : (
                    <Skeleton width={100} />
                  )}
                  {profileData.official ? (
                    <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                  ) : (
                    profileData.verified ? (
                      <box-icon type='solid' name='badge-check' color="#fff"></box-icon>
                    ) : (
                      <p></p>
                    )
                  )}
                </div>
                <div className="username">
                  {profileData.username ? `@${profileData.username}` : <Skeleton width={100} />}
                </div>
              </SkeletonTheme>
            </div>
          </div>
          <div className="list">
            <Link to={'/followers/' + profileData.username} className="lleft">
              <button className="lleft">
                {profileData.followers ? (
                  <>
                    <span>{profileData.followers.length}</span> Followers
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </button>
            </Link>
            <Link to={'/followings/' + profileData.username} className="lright">
              <button className="lright">
                {profileData.followings ? (
                  <>
                    <span>{profileData.followings.length}</span> Following
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </button>
            </Link>
          </div>
          <div className="btns">
            {isFollowing ? (
              <div className="buttons" id="followBtns">
                <button id="unFollowButton" onClick={unfollow} className="unbutton"><box-icon name='user-minus'
                  color="#6fbf7e"></box-icon>&nbsp;Unfollow</button>
              </div>
            ) : (
              isFollowingBack ? (
                <div className="buttons" id="followBtns">
                  <button id="followButton" onClick={follow}><box-icon name='user-plus'></box-icon>&nbsp;Follow
                    Back</button>
                </div>
              ) : (
                <div className="buttons" onClick={follow} id="followBtns">
                  <button id="followButton"><box-icon name='user-plus'></box-icon>&nbsp;Follow</button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="tools">
          <div className="tool">
            <Link to={`/user/${profileData.username}`} id="a" className={pageType() == 'about' ? '' : 'active'}><button><box-icon type='solid' name='quote-single-left'
              color="#6fbf7e"></box-icon>&nbsp;Posts</button>
            </Link>
          </div>
          <div className="tool">
            <Link to={`/user/${profileData.username}?type=about`} className={pageType() == 'about' ? 'active' : ''} id="d">
              <button id="about"><box-icon name='info-circle' color="#6fbf7e"></box-icon>&nbsp;About</button>
            </Link>
          </div>
        </div>
      </div>

      <div id="page">
        {pageType() !== 'about' ? (
          <Tag userData={profileData} />
        ) : (
          <About userData={profileData} />
        )}
      </div>
    </div>
  );
}

export default User;
