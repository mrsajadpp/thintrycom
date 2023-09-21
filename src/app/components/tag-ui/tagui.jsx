import Image from 'next/image'
import { redirect } from 'next/navigation';
import Link from 'next/link';


async function Tag(props) {
    return (
        <div>
            <div id={props.tag._id} key={props.tag._id} className="tweet">
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
                        {props.tag.audio ? (<Audioplayer url={props.tag.audio.src} />) : (<Link id='link-style' to={`/tag/${props.tag._id}`} dangerouslySetInnerHTML={{ __html: parseContent(props.tag.content) }}></Link>)}
                    </div>

                    {/* Date and location */}
                    <div className="date pt pb">{formatTime(props.tag.timestamp)} • from {' '}
                        <Link href={`https://www.google.com/maps/search/${encodeURIComponent(props.userData ? props.userData.created.location.region : '')}`}
                            title="Search on Google Maps">{props.userData ? props.userData.created.location.region : ''},{' '}
                            {props.userData ? props.userData.created.location.country : ''}</Link>
                    </div>

                    {/* Upvotes and Downvotes */}
                    <div className="rl pt pb">
                        <div className="retweets">
                            <b>
                                <span className="up-count" id={`main-up-count-${props.tag._id}`}>
                                    {formatNumber(props.tag.upvote ? props.tag.upvote.length : '')}
                                </span>
                            </b>{' '}
                            Upvotes
                        </div>
                        <div className="likes">
                            <b>
                                <span className="down-count" id={`main-dow-count-${props.tag._id}`}>
                                    {formatNumber(props.tag.downvote ? props.tag.downvote.length : '')}
                                </span>
                            </b>{' '}
                            Downvotes
                        </div>
                    </div>
                </div>

                {/* Icons */}
                <div className="icons">
                    <div className="ico">
                        <box-icon type='solid' name='message-square-dots' onClick={() => { navigate(`/tag/${props.tag._id}`) }} color="#fff" className="img" />
                        <div className="number">{formatNumber(props.tag.replies ? props.tag.replies.length : '')}</div>
                    </div>
                    <div className="ico">
                        <span
                            id={`up-${props.tag._id}`}
                            onClick={() => {
                                handleUpvote(props.tag._id);
                            }}
                        >
                            <box-icon
                                type="solid"
                                name="up-arrow"
                                color={userData && props.tag.upvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                                className="img"
                            />
                        </span>
                        <div className="number">
                            <span id={`up-count-${props.tag._id}`} className="up-count">
                                {formatNumber(props.tag.upvote ? props.tag.upvote.length : '')}
                            </span>
                        </div>
                    </div>

                    <div className="ico">
                        <span
                            id={`dow-${props.tag._id}`}
                            onClick={() => {
                                handleDownvote(props.tag._id);
                            }}
                        >
                            <box-icon
                                type="solid"
                                name="down-arrow"
                                color={userData && props.tag.downvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                                className="img"
                            />
                        </span>
                        <div className="number">
                            <span id={`dow-count-${props.tag._id}`} className="down-count">
                                {formatNumber(props.tag.downvote ? props.tag.downvote.length : '')}
                            </span>
                        </div>
                    </div>
                    {props.userData && props.userData._id && userData && userData._id == props.userData._id && (
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
                    )}
                    <div className="ico">
                        <box-icon name='link' color="#fff" className="img" onClick={() => copyUrl(`https://web.thintry.com/tag/${props.tag._id}`)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tag
