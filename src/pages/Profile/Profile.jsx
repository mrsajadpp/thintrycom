import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css'
import About from '../../components/About/About';
import Tag from '../../components/Tag/Tag';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Profile(props) {
  const navigate = useNavigate();

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
    const defaultTitle = "Thintry - Microblog";
    const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
    document.title = updatedTitle;

    const metaDescription = props.description ? props.description : "Welcome to Thintry, a microblogging platform.";
    const metaKeywords = props.keywords ? `${props.keywords}, microblog, Thintry, social media` : "microblog, Thintry, social media";

    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.content = metaDescription;
    }

    const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) {
      metaKeywordsTag.content = metaKeywords;
    }
  }, [props.title, props.description, props.keywords]);
  const location = useLocation();

  let [userData, setData] = useState({});
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
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const userData = await getUserDataFromCookie();
        let response = await Axios.get('https://api.thintry.com/fetch/user/posts', { params: { uid: userData._id.toString() } }, {
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

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      // Fallback for browsers that don't support Clipboard API
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = url;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp); // Convert to milliseconds
    // Now you can use the toDateString method
    const formattedTime = date.toDateString();
    return formattedTime;
  };

  const isPageActive = (path) => {
    return location.pathname === path;
  };

  function pageType() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type');
    return type;
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="dp">
            <SkeletonTheme baseColor="#0f0f0f" highlightColor="#0e0e0e">
              <div className="dp-ring">
                {!userData.profile ? (
                  // Skeleton loader for the user profile image
                  <Skeleton width={100} height={100} />
                ) : (
                  // Actual content when not loading
                  userData.profile && userData.profile ? (
                    <img
                      src={userData.profile.startsWith('/') ? 'https://api.thintry.com' + userData.profile : userData.profile}
                      alt={userData.firstname + ' ' + userData.lastname}
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
                  {userData.firstname && userData.lastname ? (
                    <>
                      {userData.firstname} {userData.lastname}
                    </>
                  ) : (
                    <Skeleton width={100} />
                  )}
                  {userData.official ? (
                    <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                  ) : (
                    userData.verified ? (
                      <box-icon type='solid' name='badge-check' color="#fff"></box-icon>
                    ) : (
                      <p></p>
                    )
                  )}
                </div>
                <div className="username">
                  {userData.username ? `@${userData.username}` : <Skeleton width={100} />}
                </div>
              </SkeletonTheme>
            </div>
          </div>
          <div className="list">
            <Link to={'/followers/' + userData.username} className="lleft">
              <button className="lleft">
                {userData.followers ? (
                  <>
                    <span>{userData.followers.length}</span> Followers
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </button>
            </Link>
            <Link to={'/followings/' + userData.username} className="lright">
              <button className="lright">
                {userData.followings ? (
                  <>
                    <span>{userData.followings.length}</span> Following
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </button>
            </Link>
          </div>
          <div className="btns">
            <div className="buttons">
              <button id="editButton" onClick={() => { navigate('/profile/edit') }}><box-icon type='solid' name='pencil'></box-icon></button>&nbsp;&nbsp;
              <button className="tbtn" onClick={() => { navigate('/settings') }}><box-icon name='cog'></box-icon></button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="tools">
          <div className="tool">
            <Link to="/profile" id="a" className={pageType() == 'about' ? '' : 'active'}><button><box-icon type='solid' name='quote-single-left'
              color="#6fbf7e"></box-icon>&nbsp;Posts</button>
            </Link>
          </div>
          <div className="tool">
            <Link to="/profile?type=about" className={pageType() == 'about' ? 'active' : ''} id="d">
              <button id="about"><box-icon name='info-circle' color="#6fbf7e"></box-icon>&nbsp;About</button>
            </Link>
          </div>
        </div>
      </div>

      <div id="page">
        {pageType() !== 'about' ? (
          <Tag userData={userData} />
        ) : (
          <About userData={userData} />
        )}
      </div>
    </div>
  );
}

export default Profile;
