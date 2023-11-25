import { gql } from '@apollo/client';

export const notificationCreated = gql`
    subscription($user_id: ID!){
        notificationCreated(user_id: $user_id){
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

export const notificationDeleted = gql`
    subscription($user_id: ID!){
        notificationDeleted(user_id: $user_id){
            _id
        }
    }
`;