import { React, useEffect, useState, Suspense, lazy, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Axios from 'axios';
import Audioplayer from '../Audioplayer/Audioplayer';
import Alert from '../Alert/Alert';
import ws from 'ws'; // Import your WebSocket library


function Tag(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlert] = useState({});
  const [upTag, setUpTag] = useState([]);
  const itemsPerPage = 20; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [filteredTags, setFilteredTags] = useState([]); // Tags to display on the current page
  const topRef = useRef(null);


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

  useEffect(() => {
    let userData = getUserDataFromCookie();
    if (userData) {
      setData(userData);
    }
  }, []);

  function parseContent(content) {
    const hashtagRegex = /#[A-Za-z0-9_-]+/g;
    const urlRegex = /(?<!href=')(?<!src=')(https?:\/\/[^\s]+)/g; // Updated regex to exclude URLs within img src attribute
    const mentionRegex = /@([A-Za-z0-9_.-]+)/g;

    const parsedUrlContent = content.replace(urlRegex, (match) => {
      return `<a href="${match}" style="color: lightblue !important;" target="_blank">${match}</a>`;
    });

    const parsedContentWithMentions = parsedUrlContent.replace(mentionRegex, (match, mention) => {
      return `<a href="/user/${mention}" style="color: lightblue !important;">${match}</a>`;
    });

    const parsedContent = parsedContentWithMentions.replace(hashtagRegex, (match) => {
      const hashtag = match.substring(1);
      return `<a href="/search?q=${hashtag}" style="color: lightblue !important;">${match}</a>`;
    });

    return parsedContent;
  }

  // ...

  useEffect(() => {
    async function getLocal() {
      try {
        // let localTag = await localStorage.getItem('userTags');
        // if (localTag) {
        // Parse the stored value as JSON
        // const parsedLocalTag = JSON.parse(localTag);
        // setTags(parsedLocalTag);
        // }
        fetchTags(props.userData._id);
      } catch (error) {
        console.error('Error retrieving data from localStorage', error);
      }
    }
    getLocal();
  }, [props.userData]);

  async function fetchTags(uid) {
    try {
      const response = await Axios.get('https://api.thintry.com/fetch/user/tags', {
        params: { uid },
      });

      if (response.data.status) {
        // Store tags in localStorage
        // localStorage.setItem('userTags', JSON.stringify(response.data.tags));
        setTags(response.data.tags);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Fetching failed', error);
    }
  }

  useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setFilteredTags(tags.slice(startIdx, endIdx));
  }, [currentPage, tags]); // Ensure it re-renders when currentPage or tags change


  // ...

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

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return (value / 1000000) + 'M';
    } else if (value >= 1000) {
      return (value / 1000) + 'K';
    } else {
      return value;
    }
  }

  function composeEmail(tag) {
    var toAddress = "help@thintry.com";
    var subject = "New post report!";

    var postData = {
      postID: tag._id,
      content: tag.content,
      timestamp: tag.timestamp,
      upvotes: tag.upvote.length,
      downvotes: tag.downvote.length
    };

    var body = JSON.stringify(postData, null, 2); // Converts the postData object to a JSON string with formatting

    var mailtoLink = "mailto:" + encodeURIComponent(toAddress) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = mailtoLink;
  }

  const displayAlert = (message, api, leftButtonText, rightButtonText, tagId) => {
    setAlert({
      message,
      api,
      leftButtonText,
      rightButtonText,
      tagId
    });
    setShowAlert(true);
  };

  const handleAlertAction = () => {
    async function delTag() {
      try {
        let response = await Axios.get('https://api.thintry.com/tag/delete', { params: { uid: userData._id, tagId: alertData.tagId } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          const updatedTags = await tags.filter(tag => tag._id.toString() !== alertData.tagId.toString());
          setTags(updatedTags);
          setShowAlert(false)
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    delTag()
  }

  const handleUpvote = async (tagId) => {
    try {
      if (!userData.status) {
        navigate('/auth/login')
      } else {
        const response = await Axios.post(
          'https://api.thintry.com/tag/upvote',
          { tagId, uid: userData._id },
          {
            headers: {
              'Access-Control-Allow-Origin': true,
            },
          }
        );

        if (response.data.status) {
          setUpTag(Math.floor(Math.random() * (1 - 9)) + 1)
        }
      }
    } catch (error) {
      console.error('Upvote failed', error);
    }
  };

  const handleDownvote = async (tagId) => {
    try {
      if (!userData.status) {
        navigate('/auth/login')
      } else {
        const response = await Axios.post(
          'https://api.thintry.com/tag/downvote',
          { tagId, uid: userData._id, profile: true },
          {
            headers: {
              'Access-Control-Allow-Origin': true,
            },
          }
        );

        if (response.data.status) {
          setUpTag(Math.floor(Math.random() * (1 - 9)) + 1)
        }
      }
    } catch (error) {
      console.error('Downvote failed', error);
    }
  };

  return (
    <div ref={topRef}>
      {isLoading ? (<>
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
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>

              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>


              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
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
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>

              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>


              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
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
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>

              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>


              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
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
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>

              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
              </div>


              <div className="ico">
                <>
                  <Skeleton width={30} height={30} />
                </>
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
      </>) : (
        <>
          {filteredTags.map(tag => (
            <div id={tag._id} key={tag._id} className="tweet">
              <div className="tweet-container pt pb pr pl">
                {/* User */}
                <div className="user pr">
                  <div className="userl" onClick={() => { navigate('/profile') }}>
                    <div className="profile">
                      <img src={props.userData.profile ? props.userData.profile.startsWith('/') ? 'https://api.thintry.com' + props.userData.profile : props.userData.profile : props.userData.profile} onError={(event) => { event.target.src = 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg'; event.target.onError = null; }} />
                    </div>
                    <div className="username">
                      <div className="name">{props.userData.firstname} {props.userData.lastname}
                        {props.userData.official ? (
                          <box-icon type='solid' name='badge-check'
                            color="#6fbf7e"></box-icon>
                        ) : (
                          props.userData.verified ? (
                            <box-icon type='solid' name='badge-check'
                              color="#fff"></box-icon>
                          ) : (
                            <p></p>
                          )
                        )}
                      </div>
                      <div className="handle">@{props.userData.username}</div>
                    </div>
                  </div>
                  <div className="userr">
                    <div className="follow">
                      <button className="bttwo post-menu" onClick={() => {
                        composeEmail(tag);
                      }}>
                        <box-icon name='flag-alt' type="solid" color="orange"></box-icon>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tweet content */}
                <div className="tweet-content pt">
                  {tag.audio ? (<Audioplayer url={tag.audio.src} />) : (<Link id='link-style' to={`/tag/${tag._id}`} dangerouslySetInnerHTML={{ __html: parseContent(tag.content) }}></Link>)}
                </div>

                {/* Date and location */}
                <div className="date pt pb">{formatTime(tag.timestamp)} • from {' '}
                  <Link to={`https://www.google.com/maps/search/${encodeURIComponent(props.userData ? props.userData.created.location.region : '')}`}
                    title="Search on Google Maps">{props.userData ? props.userData.created.location.region : ''},{' '}
                    {props.userData ? props.userData.created.location.country : ''}</Link>
                </div>

                {/* Upvotes and Downvotes */}
                <div className="rl pt pb">
                  <div className="retweets">
                    <b>
                      <span className="up-count" id={`main-up-count-${tag._id}`}>
                        {formatNumber(tag.upvote ? tag.upvote.length : '')}
                      </span>
                    </b>{' '}
                    Upvotes
                  </div>
                  <div className="likes">
                    <b>
                      <span className="down-count" id={`main-dow-count-${tag._id}`}>
                        {formatNumber(tag.downvote ? tag.downvote.length : '')}
                      </span>
                    </b>{' '}
                    Downvotes
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="icons">
                <div className="ico">
                  <box-icon type='solid' name='message-square-dots' onClick={() => { navigate(`/tag/${tag._id}`) }} color="#fff" className="img" />
                  <div className="number">{formatNumber(tag.replies ? tag.replies.length : '')}</div>
                </div>
                <div className="ico">
                  <span
                    id={`up-${tag._id}`}
                    onClick={() => {
                      handleUpvote(tag._id);
                    }}
                  >
                    <box-icon
                      type="solid"
                      name="up-arrow"
                      color={userData && tag.upvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                      className="img"
                    />
                  </span>
                  <div className="number">
                    <span id={`up-count-${tag._id}`} className="up-count">
                      {formatNumber(tag.upvote ? tag.upvote.length : '')}
                    </span>
                  </div>
                </div>

                <div className="ico">
                  <span
                    id={`dow-${tag._id}`}
                    onClick={() => {
                      handleDownvote(tag._id);
                    }}
                  >
                    <box-icon
                      type="solid"
                      name="down-arrow"
                      color={userData && tag.downvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                      className="img"
                    />
                  </span>
                  <div className="number">
                    <span id={`dow-count-${tag._id}`} className="down-count">
                      {formatNumber(tag.downvote ? tag.downvote.length : '')}
                    </span>
                  </div>
                </div>
                <div className="ico" >
                  <box-icon type='solid' name='trash' color="red" className="img" onClick={() => {
                    displayAlert('Do you really want to delete this tag?', 'https://api.thintry.com/tag/delete', 'Yes', 'No', `${tag._id}`);
                  }} />
                </div>
                <div className="ico">
                  <box-icon name='link' color="#fff" className="img" onClick={() => copyUrl(`https://web.thintry.com/tag/${tag._id}`)} />
                </div>
              </div>
            </div>))}
          {isLoading ? ('') : (
            <div className='page-btn'>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <box-icon name='chevron-left' color='#6fbf7e' ></box-icon>
              </button>
              <span style={{ color: '#fff' }}>&nbsp;&nbsp;{currentPage}&nbsp;&nbsp;</span>
              <button
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  if (topRef.current) {
                    topRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                disabled={currentPage * itemsPerPage >= tags.length}
              >
                <box-icon name='chevron-right' color='#6fbf7e'></box-icon>
              </button>
            </div>
          )}
          <div style={{ width: '100%', height: '50px' }}></div>

          {showAlert && (
            <Alert
              message={alertData.message}
              api={alertData.api}
              leftButtonText={alertData.leftButtonText}
              rightButtonText={alertData.rightButtonText}
              tagId={alertData.tagId}
              showAlert={showAlert}
              hideAlert={() => setShowAlert(false)}
              onAction={handleAlertAction}
            />
          )}
        </>)}
    </div>
  )
}

export default Tag
