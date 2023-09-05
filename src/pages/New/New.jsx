import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './New.css';

function New(props) {
    const [editorHtml, setEditorHtml] = useState('');
    let [userData, setData] = useState({});
    const [text, setInputText] = useState('');
    const [charCount, setCharCount] = useState(100);

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


    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in using the cookie
        const userData = getUserDataFromCookie();
        if (!userData || !userData.status) {
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

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const button = document.querySelector('.button');

        if (inputValue.length <= 500) {
            if (inputValue.length <= 0) {
                button.classList.remove('active');
            }
            setInputText(inputValue);
            button.classList.add('active');
        } else {
            // If it exceeds the limit, truncate the text
            setInputText(inputValue.substring(0, 500));
        }
    };

    const handleTweet = async () => {
        try {
            let inputBox = document.getElementById('content'); // Change the class name here
            if (inputBox.value.trim().length <= 0) { // Use trim() to remove leading/trailing whitespace
                inputBox.style.color = 'red';
            } else {
                const response = await Axios.post('https://api.thintry.com/tag/new', {
                    _id: userData._id,
                    content: inputBox.value, // Use textContent to get the content
                });

                if (response.data && response.data.status) {
                    navigate(`/tag/${response.data.tag._id}`);
                } else {
                    inputBox.style.color = 'red';
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="newpost-cont">
                <div className="searchdiv">
                    <button id="navbackbtn" onClick={() => {
                        navigate(-1)
                    }} type="button">
                        <box-icon type='solid' name='chevron-left' color="#6fbf7e"></box-icon>
                    </button>
                    <div style={{ width: '100%' }}></div>
                </div>
                <div className='tag-area'>
                    <div className="wrapper">
                        <div className="input-box">
                            <div className="tweet-area">
                                <textarea name="content" className='input editable' id="content" onChange={handleInputChange} cols="30" rows="10" placeholder="What's happening?">{text}</textarea>
                            </div>
                            <div className="privacy">
                                <i className="fas fa-globe-asia"></i>
                                <span>Everyone can reply</span>
                            </div>
                        </div>
                        <div className="bottom">
                            <ul className="icons">
                                <li><i className="far fa-file-image"></i></li>
                            </ul>
                            <div className="content">
                                <span className="counter">{charCount}</span>
                                <button onClick={handleTweet} className='button'><box-icon name='send'></box-icon></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default New;
