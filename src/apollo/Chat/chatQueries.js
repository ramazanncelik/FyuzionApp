import { gql } from '@apollo/client';

export const getChats = gql`
    query($user_id: ID!){
        chats(user_id: $user_id) {
            _id
        }
    }
`;

export const getChat = gql`
    query($chat_id: ID!){
        chat(chat_id: $chat_id) {
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