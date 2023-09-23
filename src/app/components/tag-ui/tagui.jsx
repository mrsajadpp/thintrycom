'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState, useEffect } from 'react';
import CommentUi from '../comment-ui/commentnui';

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


function Tag(props) {
    let router = useRouter();
    const [likes, setLike] = useState(props.tag.upvote.length);
    const [isLiked, setLiked] = useState(props.userData && props.tag.upvote.includes(props.userData._id) ? true : false);
    const [replies, setReplies] = useState([]);

    const handleLike = (event) => {
        if (isLiked) {
            setLiked(false);
            setLike(likes - 1);
        } else {
            setLiked(true);
            setLike(likes + 1);
        }
        if (!props.userData) {
            router.push('/auth/login')
        } else {
            fetch('/api/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: props.userData._id, tag_id: props.tag._id })
            }).then((t) => t.json());
        }
    }

    useEffect(() => {
        async function fetchReplies() {
            try {
                const response = await fetch(`https://api.thintry.com/fetch/tag/replies?tagId=${props.tag._id}`);
                const data = await response.json();
                if (data.replies.length > 0) {
                    setReplies(data.replies);
                }
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        }

        if (props.tag) {
            fetchReplies();
        }
    }, [props.tag]);

    return (
        <div>
            {props.tag ? (
                <div id={props.tag._id} key={props.tag._id} className="tweet">
                    <div className="tweet-container pt pb pr pl">
                        {/* User */}
                        <div className="user pr">
                            <div className="userl" onClick={() => { router.push('/user/' + props.tag.user.username) }}>
                                <div className="profile">
                                    <Image src={
                                        props.tag.user.profile
                                            ? props.tag.user.profile.startsWith('/')
                                                ? 'https://api.thintry.com' + props.tag.user.profile
                                                : props.tag.user.profile
                                            : 'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'
                                    } width={60} height={60} alt="Thintry a indian social media website."
                                        onError={(e) => {
                                            e.target.src =
                                                'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'; // Provide the default/fallback image URL here
                                        }} />
                                </div>
                                <div className="username">
                                    <div className="name">{props.tag.user.firstname} {props.tag.user.lastname} &nbsp;
                                        {props.tag.user.official ? (
                                            <svg aria-label="Verified" className="x1lliihq x1n2onr6" color="#6fbf7e" fill="#6fbf7e" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                                        ) : (
                                            props.tag.user.verified ? (
                                                <svg aria-label="Verified" className="x1lliihq x1n2onr6" color="#fff" fill="#fff" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>

                                            ) : (
                                                <p></p>
                                            )
                                        )}
                                    </div>
                                    <div className="handle">@{props.tag.user.username}</div>
                                </div>
                            </div>
                            <div className="userr">
                                <div className="follow">
                                    <button className="bttwo post-menu">
                                        <svg height="24" viewBox="0 -960 960 960" width="24" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tweet content */}
                        <div className="tweet-content pt">
                            <span dangerouslySetInnerHTML={{ __html: parseContent(props.tag.content) }}></span>
                        </div>

                        {/* Date and location */}
                        <div className="date pt pb">{formatTime(props.tag.timestamp)} • from {' '}
                            <Link href={`https://www.google.com/maps/search/${encodeURIComponent(props.userData ? props.tag.user.created.location.region : '')}`}
                                title="Search on Google Maps">{props.userData ? props.tag.user.created.location.region : ''},{' '}
                                {props.userData ? props.tag.user.created.location.country : ''}</Link>
                        </div>

                        {/* Upvotes and Downvotes */}
                        <div className="rl pt pb">
                            <div className="retweets">
                                <b>
                                    <span className="up-count" id={`main-up-count-${props.tag._id}`}>
                                        {formatNumber(likes)}
                                    </span>
                                </b>{' '}
                                Likes
                            </div>
                            <div className="likes">
                                <b>
                                    <span className="down-count" id={`main-dow-count-${props.tag._id}`}>
                                        {formatNumber(props.tag.replies ? props.tag.replies.length : '0')}
                                    </span>
                                </b>{' '}
                                Comments
                            </div>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="icons" style={{ marginLeft: '10px' }}>
                        <div className="ico" onClick={handleLike}>
                            <span
                                id={`up-${props.tag._id}`}
                            >
                                {isLiked ? (
                                    <svg aria-label="Unlike" className="x1lliihq x1n2onr6" color='#6fbf7e' fill='#6fbf7e' height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                ) : (
                                    <svg aria-label="Like" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                )}
                            </span>
                            <span className='number'>{formatNumber(likes)}</span>
                        </div>

                        <div className="ico">
                            <svg aria-label="Comment" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                            <span className='number'>{formatNumber(props.tag.replies ? props.tag.replies.length : '0')}</span>
                        </div>
                        {/* {props.tag.user && props.tag.user._id && props.userData && props.userData._id == props.tag.user._id && (
                            <div className="ico">
                                <box-icon
                                    type='solid'
                                    name='trash'
                                    color="red"
                                    className="img"
                                    onClick={() => {
                                        displayAlert('Do you really want to delete this tag?', 'https://api.thintry.com/tag/delete', 'Yes', 'No', `${props.tag._id}`);
                                    }}
                                />
                            </div>
                        )} */}
                        <div className="ico">
                            <svg aria-label="Share Post" className="x1lliihq x1n2onr6" onClick={() => copyUrl(`https://web.thintry.com/tag/${props.tag._id}`)} color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                        </div>
                    </div>
                </div>) : (
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
                </SkeletonTheme>
            )}
            <div className="wrap pt">
                {replies.slice(0, 2).map((reply) => reply.user ? (<CommentUi key={reply._id} userData={props.userData} tag={props.tag} reply={reply} />) : (''))}
            </div>
        </div>
    )
}

export default Tag
