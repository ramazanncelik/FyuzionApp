import React from 'react'
import ConnectionNotification from './ConnectionNotification'
import FollowerNotification from './FollowerNotification'
import PostLikeNotification from './PostLikeNotification'
import CommentNotification from './CommentNotification'

const Notification = ({ notificationData }) => {

    return (
        <>
            {notificationData.Type === "connection" &&
                <ConnectionNotification notificationData={notificationData} />
                ||
                notificationData.Type === "follower" &&
                <FollowerNotification notificationData={notificationData} />
                ||
                notificationData.Type === "postLike" &&
                <PostLikeNotification notificationData={notificationData} />
                ||
                notificationData.Type === "comment" &&
                <CommentNotification notificationData={notificationData} />
            }
        </>
    )
}

export default Notification