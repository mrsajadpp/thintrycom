'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';

function getTimeAgo(timestamp) {
    const currentTimestamp = Date.now();
    const targetTimestamp = new Date(timestamp).getTime();
    const timeDifference = currentTimestamp - targetTimestamp;

    const minuteInMillis = 60 * 1000;
    const hourInMillis = 60 * minuteInMillis;
    const dayInMillis = 24 * hourInMillis;
    const weekInMillis = 7 * dayInMillis;
    const monthInMillis = 30 * dayInMillis; // Assuming an average of 30 days per month
    const yearInMillis = 365 * dayInMillis; // Assuming 365 days per year

    const yearsAgo = Math.floor(timeDifference / yearInMillis);
    const monthsAgo = Math.floor(timeDifference / monthInMillis);
    const weeksAgo = Math.floor(timeDifference / weekInMillis);
    const daysAgo = Math.floor(timeDifference / dayInMillis);
    const hoursAgo = Math.floor(timeDifference / hourInMillis);
    const minutesAgo = Math.floor(timeDifference / minuteInMillis);
    const secondsAgo = Math.floor(timeDifference / 1000);

    if (yearsAgo > 0) {
        return `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
        return `${monthsAgo}mo ago`;
    } else if (weeksAgo > 0) {
        return `${weeksAgo}w ago`;
    } else if (daysAgo > 0) {
        return `${daysAgo}d ago`;
    } else if (hoursAgo > 0) {
        return `${hoursAgo}h ago`;
    } else if (minutesAgo > 0) {
        return `${minutesAgo}m ago`;
    } else {
        return `${secondsAgo}s ago`;
    }
}

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


function CommentUi(props) {
    let router = useRouter();
    const [likes, setLike] = React.useState(props.tag.upvote.length);
    const [isLiked, setLiked] = React.useState(props.userData && props.tag.upvote.includes(props.userData._id) ? true : false);

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

    console.log(props.reply)
    return (
        <div className="box">
            <div className="line">
                <div className="border"></div>
                <Image className='avatar' src={
                    props.reply.user.profile
                        ? props.reply.user.profile.startsWith('/')
                            ? 'https://api.thintry.com' + props.reply.user.profile
                            : props.reply.user.profile
                        : 'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'
                } width={60} height={60} alt="Thintry a indian social media website."
                    onError={(e) => {
                        e.target.src =
                            'https://i.postimg.cc/jqZBwHRD/bc75882d906b263fbe0550fe59dc7b21.jpg'; // Provide the default/fallback image URL here
                    }} />
            </div>
            <div className="content">
                <div className="info">
                    <div className="userinfo sl">
                        <div className="name">{props.reply.user.firstname} {props.reply.user.lastname} &nbsp;
                            {props.reply.user.official ? (
                                <svg aria-label="Verified" className="x1lliihq x1n2onr6" color="#6fbf7e" fill="#6fbf7e" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                            ) : (
                                props.reply.user.verified ? (
                                    <svg aria-label="Verified" className="x1lliihq x1n2onr6" color="#fff" fill="#fff" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>

                                ) : (
                                    <p></p>
                                )
                            )}
                        </div>&nbsp;
                        <div className="handle">@{props.reply.user.username}</div>
                        <div className="time">{getTimeAgo(props.reply.timestamp)}</div>
                    </div>
                </div>
                <div className="replyto sl">Replying to <a>@{props.tag.user.username}</a></div>
                <div className="subtweet-content sl"><span dangerouslySetInnerHTML={{ __html: parseContent(props.reply.content) }}></span></div>
                <div className="icons">
                    <div className="ico" onClick={handleLike}>
                        <span
                            id={`up-${props.reply._id}`}
                            onClick={() => {
                                handleUpvote(props.reply._id);
                            }}
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
                        <svg aria-label="Comment" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                            fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <title>Comment</title>
                            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none"
                                stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div className="number">{formatNumber(props.tag.replies ? props.tag.replies.length : '0')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentUi
