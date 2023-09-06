import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import './Followers.css';

function Followers(props) {
    let navigate = useNavigate();
    let [userData, setData] = useState({});
    let [profileData, setProfile] = useState({});
    const [followers, setFollowers] = useState();
    const { username } = useParams();
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
    useEffect(() => {
        // Hide the header and footer when the component mounts
        const header = document.querySelector('.header'); // Replace with your header class or ID
        const footer = document.querySelector('.footer'); // Replace with your footer class or ID

        if (header) {
            header.style.display = 'none';
        }
        if (footer) {
            footer.style.display = 'none';
        }

        // Clean up by showing the header and footer when component unmounts
        return () => {
            if (header) {
                header.style.removeProperty('display');
            }
            if (footer) {
                footer.style.removeProperty('display');
            }
        };
    }, []);
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
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        fetchProfileData();
    }, [navigate]);

    useEffect(() => {
        const fetchFollowers = async () => {
            // /user/followers
            try {
                let response = await Axios.post('https://api.thintry.com/user/followers', { username }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    // setCookie('userData', JSON.stringify(response.data.user), 1);
                    console.log(response.data);
                    setFollowers(response.data.followers)
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        fetchFollowers();
    }, [profileData])
    return (
        <div>
            <div className="settings-container">
                <div className="searchdiv">
                    <button id="navbackbtn" onClick={() => { navigate(-1) }} type="button">
                        <box-icon type='solid' name='chevron-left' color="#6fbf7e"></box-icon>
                    </button>
                    <div className="page-head">Followers</div>
                </div>
                <div className="about-container">
                    {followers && followers.length ? (
                        followers.map((follower) => (
                            <div id={follower.followerDetails._id} key={follower.followerDetails._id} className="tweet">
                                <div className="tweet-container pt pb pr pl">
                                    <div className="user pr" onClick={() => { navigate(`/user/${follower.followerDetails.username}`) }}>
                                        <div className="profile">
                                            <img
                                                src={follower && follower.followerDetails ? (follower.followerDetails.profile.startsWith('/') ? 'https://api.thintry.com' + follower.followerDetails.profile : follower.followerDetails.profile) : 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg'}
                                                onError={(event) => {
                                                    event.target.src = 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg';
                                                    event.target.onError = null;
                                                }}
                                            />
                                        </div>
                                        <div className="username">
                                            <div className="name">
                                                {follower.followerDetails && follower.followerDetails.firstname && follower.followerDetails.lastname ? (
                                                    <>
                                                        {follower.followerDetails.firstname} {follower.followerDetails.lastname}
                                                        {follower.followerDetails.official ? (
                                                            <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                                                        ) : (
                                                            follower.followerDetails.verified ? (
                                                                <box-icon type='solid' name='badge-check' color="#fff" ></box-icon>
                                                            ) : (
                                                                <p></p>
                                                            )
                                                        )}
                                                    </>
                                                ) : 'Unknown'}
                                            </div>
                                            <div className="handle">@{follower.followerDetails.username}</div>
                                        </div>
                                        <div className="userr">
                                            <div className="follow">
                                                <button className="bttwo" onClick={() => { navigate(`/user/${follower.followerDetails.username}`) }}>
                                                    <box-icon name='user' color="#6fbf7e"></box-icon>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="null">
                            <span>No Followers</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Followers
