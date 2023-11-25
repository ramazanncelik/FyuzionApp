import {gql} from '@apollo/client';

export const chatCreated = gql`
    subscription($user_id: ID!){
        chatCreated(user_id: $user_id) {
            _id
        }
    }
`;

export const chatUpdated = gql`
    subscription($chat_id: ID!){
        chatUpdated(chat_id: $chat_id) {
            _id
            toUser {
              _id
              ImageUrl
              NickName
            }
            lastMessageOwner {
              _id
              NickName
            }
            Type
            LastMessage
            Date
            Time
        }
    }
`;

export const chatDeleted = gql`
    subscription($user_id: ID!){
        chatDeleted(user_id: $user_id) {
            _id
        }
    }
`;