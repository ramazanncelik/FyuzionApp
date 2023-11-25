import { gql } from '@apollo/client';

export const messageCreated = gql`
    subscription($chat_id: ID!) {
        messageCreated(chat_id: $chat_id) {
            _id
            Time
        }
    }
`;

export const messageUpdated = gql`
subscription($message_id: ID!) {
    messageUpdated(message_id: $message_id) {
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

export const messageDeleted = gql`
    subscription($chat_id: ID!) {
        messageDeleted(chat_id: $chat_id) {
            _id
        }
    }
`;