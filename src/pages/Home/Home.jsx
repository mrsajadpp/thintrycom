import { React, useEffect, useState, Suspense, lazy, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Axios from 'axios';
import Audioplayer from '../../components/Audioplayer/Audioplayer';
import Alert from '../../components/Alert/Alert';

function Home(props) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setData] = useState([]);
    const [tags, setTags] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlert] = useState({});
    const itemsPerPage = 30; // Number of items to display per page
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
        async function getLocal() {
            try {
                let localTag = await localStorage.getItem('tags');
                if (localTag) {
                    // Parse the stored value as JSON
                    const parsedLocalTag = JSON.parse(localTag);
                    setTags(parsedLocalTag);
                    setIsLoading(false);
                    fetchAllTags();
                } else {
                    fetchAllTags();
                }
            } catch (error) {
                console.error('Error retrieving data from localStorage', error);
            }
        }
        getLocal();
    }, []);

    async function fetchAllTags() {
        try {
            const response = await fetch('https://api.thintry.com/fetch/user/tags/all');

            if (response.ok) {
                const data = await response.json();
                if (data.status) {
                    // Store tags in localStorage
                    localStorage.setItem('tags', JSON.stringify(data.tags));
                    setTags(data.tags);
                }
            } else {
                console.error('Failed to fetch data');
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Fetching failed', error);
        }
    }

    useEffect(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        setFilteredTags(tags.slice(startIdx, endIdx));
    }, [currentPage, tags]); // Ensure it re-renders when currentPage or tags change



    useEffect(() => {
        let userData = getUserDataFromCookie();
        if (userData) {
            setData(userData);
        }
    }, []);

    function parseContent(content) {
        if (!content) {
            return 'Unknown content!'; // Return an empty string if content is undefined or null
        }
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
                    setTags(response.data.tags)
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
                    { tagId, uid: userData._id },
                    {
                        headers: {
                            'Access-Control-Allow-Origin': true,
                        },
                    }
                );

                if (response.data.status) {
                    setTags(response.data.tags)
                }
            }
        } catch (error) {
            console.error('Downvote failed', error);
        }
    };

    return (
        <div style={{ marginTop: '60px' }} ref={topRef} id='page'>
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
                                    <div className="userl" onClick={() => { navigate('/user/' + tag.user.username) }}>
                                        <div className="profile">
                                            {isLoading ? (
                                                // Skeleton loader for the profile image
                                                <Skeleton width={50} height={50} />
                                            ) : (
                                                <img
                                                    src={tag.user && tag.user.profile ? (tag.user.profile.startsWith('/') ? 'https://api.thintry.com' + tag.user.profile : tag.user.profile) : 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg'}
                                                    onError={(event) => {
                                                        event.target.src = 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg';
                                                        event.target.onError = null;
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="username">
                                            <div className="name">
                                                {isLoading ? (
                                                    // Skeleton loader for the name and verification badge
                                                    <Skeleton width={100} />
                                                ) : (
                                                    <>
                                                        {tag.user && tag.user.firstname && tag.user.lastname ? (
                                                            <>
                                                                {tag.user.firstname} {tag.user.lastname}
                                                                {tag.user.official ? (
                                                                    <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                                                                ) : (
                                                                    tag.user.verified ? (
                                                                        <box-icon type='solid' name='badge-check' color="#fff"></box-icon>
                                                                    ) : (
                                                                        <p></p>
                                                                    )
                                                                )}
                                                            </>
                                                        ) : 'Unknown'}
                                                    </>
                                                )}
                                            </div>

                                            <div className="handle">
                                                {isLoading ? (
                                                    // Skeleton loader for the handle (username)
                                                    <Skeleton width={80} />
                                                ) : (
                                                    <>{tag.user && tag.user.username ? `@${tag.user.username}` : '@unknown'}</>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="userr">
                                        {isLoading ? (
                                            // Skeleton loader for the "Follow" button
                                            <Skeleton width={100} height={40} />
                                        ) : (
                                            <div className="follow">
                                                <button className="bttwo post-menu" onClick={() => {
                                                    composeEmail(tag);
                                                }}>
                                                    <box-icon name='flag-alt' type="solid" color="orange"></box-icon>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tweet content */}
                                <div className="tweet-content pt">
                                    {isLoading ? (
                                        // Skeleton loader for the tweet content
                                        <Skeleton width={'100%'} height={100} />
                                    ) : (
                                        <>
                                            {tag.audio ? (
                                                <Audioplayer url={tag.audio.src} />
                                            ) : (
                                                <Link id='link-style' to={`/tag/${tag._id}`} dangerouslySetInnerHTML={{ __html: parseContent(tag.content) }}></Link>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Date and location */}
                                <div className="date pt pb">
                                    {isLoading ? (
                                        // Skeleton loader for the date and location
                                        <>
                                            <Skeleton width={100} />
                                            <Skeleton width={100} />
                                        </>
                                    ) : (
                                        <>
                                            {formatTime(tag.timestamp)} • from {' '}
                                            <Link to={`https://www.google.com/maps/search/${encodeURIComponent(tag.user ? tag.user.created.location.region : 'unknown')}`}
                                                title="Search on Google Maps">{tag.user ? tag.user.created.location.region : 'Unknown'},{' '}
                                                {tag.user ? tag.user.created.location.country : 'NA'}</Link>
                                        </>
                                    )}
                                </div>


                                {/* Upvotes and Downvotes */}
                                <div className="rl pt pb">
                                    {isLoading ? (
                                        // Skeleton loader for the "Upvotes" and "Downvotes" count
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
                                    ) : (
                                        <div className="content">
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
                                    )}
                                </div>
                            </div>

                            {/* Icons */}
                            <div className="icons">
                                <div className="ico">
                                    {isLoading ? (
                                        // Skeleton loader for the "message-square-dots" icon and replies count
                                        <>
                                            <Skeleton width={30} height={30} />
                                        </>
                                    ) : (
                                        <>
                                            <box-icon
                                                type='solid'
                                                name='message-square-dots'
                                                onClick={() => { navigate(`/tag/${tag._id}`) }}
                                                color="#fff"
                                                className="img"
                                            />
                                            <div className="number">{formatNumber(tag.replies ? tag.replies.length : '0')}</div>
                                        </>
                                    )}
                                </div>

                                <div className="ico">
                                    {isLoading ? (
                                        // Skeleton loader for the upvote icon and count
                                        <>
                                            <Skeleton width={30} height={30} />
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>


                                <div className="ico">
                                    {isLoading ? (
                                        // Skeleton loader for the downvote icon and count
                                        <>
                                            <Skeleton width={30} height={30} />
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>

                                {isLoading ? (
                                    // Skeleton loader for the "trash" icon
                                    <div className="ico">
                                        <Skeleton width={30} height={30} />
                                    </div>
                                ) : (
                                    // Actual content when not loading
                                    tag.user && tag.user._id && userData && userData._id == tag.user._id && (
                                        <div className="ico">
                                            <box-icon
                                                type='solid'
                                                name='trash'
                                                color="red"
                                                className="img"
                                                onClick={() => {
                                                    displayAlert('Do you really want to delete this tag?', 'https://api.thintry.com/tag/delete', 'Yes', 'No', `${tag._id}`);
                                                }}
                                            />
                                        </div>
                                    )
                                )}

                                <div className="ico">
                                    {isLoading ? (
                                        <Skeleton width={30} height={30} />
                                    ) : (
                                        // Actual content when not loading
                                        <box-icon
                                            name='link'
                                            color="#fff"
                                            className="img"
                                            onClick={() => copyUrl(`https://api.thintry.com/tag/${tag._id}`)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>))}
                    <div className='page-btn'>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <box-icon name='chevron-left' ></box-icon>
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            onClick={() => {
                                setCurrentPage(currentPage + 1);
                                if (topRef.current) {
                                    topRef.current.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            disabled={currentPage * itemsPerPage >= tags.length}
                        >
                            <box-icon name='chevron-right'></box-icon>
                        </button>
                    </div>
                    <div style={{ width: '100%', height: '100px' }}></div>
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
                </>
            )}
        </div>
    )
}

export default Home;
