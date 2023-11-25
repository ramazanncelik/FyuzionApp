import { gql } from '@apollo/client';

export const createMessage = gql`
    mutation($data: CreateMessageInput!){
        createMessage(data: $data)
    }
`;

export const updateMessage = gql`
    mutation($data: UpdateMessageInput!){
        updateMessage(data: $data)
    }
`;

export const deleteMessage = gql`
    mutation($data: DeleteMessageInput!){
        deleteMessage(data: $data)
    }
`;