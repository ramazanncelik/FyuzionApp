import { gql } from '@apollo/client';

export const getMessages = gql`
    query($chat_id: ID!){
        messages(chat_id: $chat_id) {
            _id
        }
    }
`;

export const getMessage = gql`
    query($message_id: ID!) {
        message(message_id: $message_id) {
            _id
            From
            fromUser {
                _id
                NickName
                Name
            }
            To
            Type
            Description
            File {
                FileName
                FilePath
                FileType
                FileUrl
            }
            Date
            Time
            IsEdited
        }
    }
`;