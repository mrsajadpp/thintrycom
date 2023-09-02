import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Editprofile.css';

function Editprofile(props) {
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
    const location = useLocation();

    const [userData, addData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        about: '',
        profile: ''
    });

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
        let userData = getUserDataFromCookie();
        if (!userData) {
            navigate('/auth/login');
            return;
        }
        addData(userData);
    }, [navigate]);

    function getUserDataFromCookie() {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userData='));

        if (cookieValue) {
            const valuePair = cookieValue.split('=');
            if (valuePair.length === 2) {
                return JSON.parse(decodeURIComponent(valuePair[1]));
            }
        }
        return null;
    }

    useEffect(() => {
        const defaultTitle = 'Thintry - Microblog';
        const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
        document.title = updatedTitle;

        const metaDescription = props.description
            ? props.description
            : 'Welcome to Thintry, a microblogging platform.';
        const metaKeywords = props.keywords
            ? `${props.keywords}, microblog, Thintry, social media`
            : 'microblog, Thintry, social media';

        const metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (metaDescriptionTag) {
            metaDescriptionTag.content = metaDescription;
        }

        const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
        if (metaKeywordsTag) {
            metaKeywordsTag.content = metaKeywords;
        }
    }, [props.title, props.description, props.keywords]);

    const [usernameErr, addUserErr] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [change, addChange] = useState(1)

    useEffect(() => {
        checkDisabled();
    }, [change, usernameErr]);

    function checkDisabled() {
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const username = document.getElementById('username').value;
        const about = document.getElementById('about').value;

        const submitBtn = document.getElementById('submitBtn');

        const isDisabled =
            firstname.length === 0 ||
            lastname.length === 0 ||
            username.length === 0 ||
            usernameErr ||
            about.length === 0;
        setIsSubmitDisabled(isDisabled);
        if (isDisabled) {
            submitBtn.style.opacity = 0.5;
        } else {
            submitBtn.style.removeProperty('opacity');
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const fileInput = document.querySelector('input[type="file"]');
        formData.append('profilePicture', fileInput.files[0]);
        formData.append('uid', userData._id);

        try {
            console.log(userData._id)

            let response = await Axios.post('https://api.thintry.com/user/update', formData, {
                headers: {
                    'Access-Control-Allow-Origin': true,
                    'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
                }
            });

            if (response.data.status) {
                setCookie('userData', JSON.stringify(response.data.user), 1); // Cookie will expire in 1 day
                navigate('/profile');
            } else {
                // Handle error case
                console.error('Update failed');
            }
        } catch (error) {
            console.error('Update failed', error);
        }
    }

    const handleUSername = (event) => {
        let username = document.getElementById('username');
        let submitBtn = document.getElementById('submitBtn');
        const newValue = username.value
            .replace(/ /g, '')
            .toLowerCase();
        username.value = newValue;
        addChange(change + 1);

        if (newValue.length <= 0) {
            username.classList.replace('noerror-inp', 'error-inp');
        } else {
            Axios.get(
                'https://api.thintry.com/username/check',
                { params: { username: newValue } },
                {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    },
                }
            )
                .then((response) => {
                    if (response.data) {
                        if (
                            response.data.usernameExist &&
                            userData.username !== newValue
                        ) {
                            addUserErr(true);
                            username.classList.replace('noerror-inp', 'error-inp');
                        } else {
                            addUserErr(false);
                            username.classList.replace('error-inp', 'noerror-inp');
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName('');
        }
        addChange(change + 1);
        handleUSername(e);
    };

    const openFileInput = () => {
        const choosePic = document.getElementById('choosePic');
        choosePic.click();
    };

    return (
        <div>
            <div className="edit-container" id="editContainer">
                <div className="searchdiv">
                    <button
                        id="navbackbtn"
                        onClick={() => {
                            navigate(-1)
                        }}
                        type="button"
                    >
                        <box-icon
                            type="solid"
                            name="chevron-left"
                            color="#6fbf7e"
                        ></box-icon>
                    </button>
                    <div></div>
                </div>
                <div className="editForm">
                    <div className="inputs">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="name">
                                <div className="input">
                                    <input
                                        type="text"
                                        className="noerror-inp"
                                        id="firstname"
                                        name="firstname"
                                        defaultValue={userData.firstname}
                                        placeholder="First Name"
                                        required
                                        autoComplete="off"
                                        onChange={(e) => {
                                            let firstname = document.getElementById('firstname');
                                            let submitBtn = document.getElementById('submitBtn');
                                            addChange(change + 1);
                                            if (firstname.value.length <= 0) {
                                                firstname.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                firstname.classList.replace('error-inp', 'noerror-inp');
                                            }
                                            handleUSername(e);
                                        }}
                                    />
                                    <span id="firstnameError" className="error"></span>
                                </div>
                                &nbsp;
                                <div className="input">
                                    <input
                                        className="noerror-inp"
                                        type="text"
                                        id="lastname"
                                        defaultValue={userData.lastname}
                                        name="lastname"
                                        placeholder="Last Name"
                                        required
                                        autoComplete="off"
                                        onChange={(e) => {
                                            let lastname = document.getElementById('lastname');
                                            let submitBtn = document.getElementById('submitBtn');
                                            addChange(change + 1);
                                            if (lastname.value.length <= 0) {
                                                lastname.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                lastname.classList.replace('error-inp', 'noerror-inp');
                                            }
                                            handleUSername(e);
                                        }}
                                    />
                                    <span id="lastnameError" className="error"></span>
                                </div>
                            </div>
                            <div className="input">
                                <input
                                    type="text"
                                    className="noerror-inp"
                                    id="username"
                                    defaultValue={userData.username}
                                    name="username"
                                    placeholder="Username"
                                    required
                                    autoComplete="off"
                                    onChange={handleUSername}
                                />
                                <span id="usernameError" className="error"></span>
                            </div>
                            <div className="input">
                                <input type="file" id='choosePic' onChange={handleFileChange} hidden />
                                <button
                                    type="button" onClick={openFileInput}>
                                    <box-icon name='image-add'></box-icon><span>{selectedFileName}</span>
                                </button>
                            </div>
                            <div className="name">
                                <div className="input">
                                    <input
                                        type="number"
                                        className="noerror-inp"
                                        id="day"
                                        name="day"
                                        defaultValue={userData.dob ? userData.dob.day : ''}
                                        placeholder="DOB Day"
                                        required
                                        autoComplete="off"
                                        onChange={(e) => {
                                            if (e.target.value.length > 2) {
                                                e.target.value = e.target.value.substring(0, 2)
                                            }
                                            if (parseInt(e.target.value) > 31) {
                                                e.target.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                e.target.classList.replace('error-inp', 'noerror-inp');
                                            }
                                            handleUSername(e);
                                        }}
                                    />
                                    <span id="firstnameError" className="error"></span>
                                </div>
                                &nbsp;
                                <div className="input">
                                    <input
                                        className="noerror-inp"
                                        type="number"
                                        id="month"
                                        defaultValue={userData.dob ? userData.dob.month : ''}
                                        name="month"
                                        placeholder="DOB Month"
                                        required
                                        autoComplete="off"
                                        onChange={(e) => {
                                            if (e.target.value.length > 2) {
                                                e.target.value = e.target.value.substring(0, 2)
                                            }
                                            if (parseInt(e.target.value) > 12) {
                                                e.target.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                e.target.classList.replace('error-inp', 'noerror-inp');
                                            }
                                            handleUSername(e);
                                        }}
                                    />
                                    <span id="lastnameError" className="error"></span>
                                </div>
                                &nbsp;
                                <div className="input">
                                    <input
                                        className="noerror-inp"
                                        type="number"
                                        id="year"
                                        defaultValue={userData.dob ? userData.dob.year : ''}
                                        name="year"
                                        placeholder="DOB Year"
                                        required
                                        autoComplete="off"
                                        onChange={(e) => {
                                            if (e.target.value.length > 4) {
                                                e.target.value = e.target.value.substring(0, 2)
                                            }
                                            if (parseInt(e.target.value) > 2014) {
                                                e.target.classList.replace('noerror-inp', 'error-inp');
                                            } else {
                                                e.target.classList.replace('error-inp', 'noerror-inp');
                                            }
                                            handleUSername(e);
                                        }}
                                    />
                                    <span id="lastnameError" className="error"></span>
                                </div>
                            </div>
                            <div className="input">
                                <input
                                    type="text"
                                    className="noerror-inp"
                                    id="about"
                                    defaultValue={userData.about}
                                    name="about"
                                    placeholder="Write about yourself."
                                    required
                                    autoComplete="off"
                                    onChange={(e) => {
                                        let about = document.getElementById('about');
                                        let submitBtn = document.getElementById('submitBtn');
                                        addChange(change + 1);
                                        if (about.value.length <= 0) {
                                            about.classList.replace('noerror-inp', 'error-inp');
                                        } else {
                                            about.classList.replace('error-inp', 'noerror-inp');
                                        }
                                        handleUSername(e);
                                    }}
                                />
                                <span id="usernameError" className="error"></span>
                            </div>
                            <div className="loginbtn">
                                <button
                                    type="submit"
                                    id="submitBtn"
                                    disabled={isSubmitDisabled}
                                >
                                    <box-icon name="check"></box-icon>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Editprofile;
