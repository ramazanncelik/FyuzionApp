import { gql } from '@apollo/client';

export const getNotifications = gql`
    query($user_id: ID!) {
        notifications(user_id: $user_id){
            _id
            From
            To
            Type
            PostId
            Date
            Time
            fromUser{
                _id
                NickName
                Name
                ImageUrl
            }
        }
    }
`;

export const getNotification = gql`
    query($data: NotificationInput!){
        notification(data: $data){
            _id
        }
    }
`;