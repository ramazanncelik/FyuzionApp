import { gql } from '@apollo/client';

export const createOrUpdateChat = gql`
    mutation createOrUpdateChat($fromToData: ChatFromToInput!, $data: ChatDataInput!){
        createOrUpdateChat(fromToData: $fromToData, data: $data)
    }
`;

export const deleteChat = gql`
    mutation($chat_id: ID!){
        deleteChat(chat_id: $chat_id)
    }
`;