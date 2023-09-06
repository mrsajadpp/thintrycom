import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import './Followings.css';

function Followings(props) {
    let navigate = useNavigate();
    let [userData, setData] = useState({});
    let [profileData, setProfile] = useState({});
    const [followings, setFollowings] = useState();
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
        const fetchfollowings = async () => {
            // /user/followings
            try {
                let response = await Axios.post('https://api.thintry.com/user/followings', { username }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    // setCookie('userData', JSON.stringify(response.data.user), 1);
                    console.log(response.data);
                    setFollowings(response.data.followings)
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        fetchfollowings();
    }, [profileData]);
    console.log(followings)
    return (
        <div>
            <div className="settings-container">
                <div className="searchdiv">
                    <button id="navbackbtn" onClick={() => { navigate(-1) }} type="button">
                        <box-icon type='solid' name='chevron-left' color="#6fbf7e"></box-icon>
                    </button>
                    <div className="page-head">Followings</div>
                </div>
                <div className="about-container">
                    {followings && followings.length ? (
                        followings.map((following) => (
                            <div id={following.followingDetails._id} key={following.followingDetails._id} className="tweet">
                                <div className="tweet-container pt pb pr pl">
                                    <div className="user pr" onClick={() => { navigate(`/user/${following.followingDetails.username}`) }}>
                                        <div className="profile">
                                            <img
                                                src={following && following.followingDetails ? (following.followingDetails.profile.startsWith('/') ? 'https://api.thintry.com' + following.followingDetails.profile : following.followingDetails.profile) : 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg'}
                                                onError={(event) => {
                                                    event.target.src = 'https://i.postimg.cc/JhpkJZCd/1cc535901e32f18db87fa5e340a18aff.jpg';
                                                    event.target.onError = null;
                                                }}
                                            />
                                        </div>
                                        <div className="username">
                                            <div className="name">
                                                {following.followingDetails && following.followingDetails.firstname && following.followingDetails.lastname ? (
                                                    <>
                                                        {following.followingDetails.firstname} {following.followingDetails.lastname}
                                                        {following.followingDetails.official ? (
                                                            <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                                                        ) : (
                                                            following.followingDetails.verified ? (
                                                                <box-icon type='solid' name='badge-check' color="#fff" ></box-icon>
                                                            ) : (
                                                                <p></p>
                                                            )
                                                        )}
                                                    </>
                                                ) : 'Unknown'}
                                            </div>
                                            <div className="handle">@{following.followingDetails.username}</div>
                                        </div>
                                        <div className="userr">
                                            <div className="follow">
                                                <button className="bttwo" onClick={() => { navigate(`/user/${following.followingDetails.username}`) }}>
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
                            <span>No followings</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Followings
