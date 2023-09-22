'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';

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
    return (
        <div>
            <div class="wrap pt">

                <div class="box">
                    <div class="line">
                        <div class="border"></div>
                        <img class="avatar" src="https://api.thintry.com/profile/64dcf77a92b1b28acbf1dc9b.jpeg" />
                    </div>
                    <div class="content">
                        <div class="info">
                            <div class="userinfo sl">
                                <div class="name">Romain</div>&nbsp;
                                <div class="handle">@imromains</div>
                                <div class="time">10m</div>
                            </div>
                        </div>
                        <div class="replyto sl">Replying to <a>@imromains</a></div>
                        <div class="subtweet-content sl">You can follow me on twitter too ٩(◕‿◕｡)۶ <a
                            href="http://twitter.com/imromains" target="_blank">twitter.com/imromains</a></div>
                        <div class="icons">
                            <div class="ico">
                                <svg aria-label="Unlike" class="x1lliihq x1n2onr6" color='#6fbf7e' fill='#6fbf7e' height="24"
                                    role="img" viewBox="0 0 48 48" width="24">
                                    <title>Unlike</title>
                                    <path
                                        d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z">
                                    </path>
                                </svg>
                                <div class="number">2K</div>
                            </div>
                            <div class="ico">
                                <svg aria-label="Comment" class="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                                    fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                                    <title>Comment</title>
                                    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none"
                                        stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <div class="number">1</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="box">
                    <div class="line">
                        <div class="border"></div>
                        <img class="avatar" src="https://api.thintry.com/profile/64dcf77a92b1b28acbf1dc9b.jpeg" />
                    </div>
                    <div class="content">
                        <div class="info">
                            <div class="userinfo sl">
                                <div class="name">Romain</div> &nbsp;
                                <div class="handle">@imromains</div>
                                <div class="time">2m</div>
                            </div>
                        </div>

                        <div class="subtweet-content sl pb">The HTML and CSS are probably messy and not really great 😱 I'm not
                            an expert </div>
                        <div class="icons">
                            <div class="ico">
                                <svg aria-label="Unlike" class="x1lliihq x1n2onr6" color='#6fbf7e' fill='#6fbf7e' height="24"
                                    role="img" viewBox="0 0 48 48" width="24">
                                    <title>Unlike</title>
                                    <path
                                        d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z">
                                    </path>
                                </svg>
                                <div class="number">2K</div>
                            </div>
                            <div class="ico">
                                <svg aria-label="Comment" class="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                                    fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                                    <title>Comment</title>
                                    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none"
                                        stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <div class="number">1</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentUi
