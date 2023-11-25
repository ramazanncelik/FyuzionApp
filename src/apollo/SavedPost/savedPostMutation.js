import { gql } from '@apollo/client';

export const addSavedPost = gql`
    mutation($data: CreateSavedPostInput!){
        createSavedPost(data: $data)
    }
`;

export const removeSavedPost = gql`
    mutation($savedPost_id: ID!){
        deleteSavedPost(savedPost_id: $savedPost_id)
    }
`;