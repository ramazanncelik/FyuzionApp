import { gql } from '@apollo/client';

export const getSavedPosts = gql`
    query($user_id: ID!){
        savedPosts(user_id: $user_id) {
            PostId
            Time
        }
    }
`;

export const getSavedPost = gql`
    query($data: SavedPostInput!){
        savedPost(data: $data) {
            _id
        }
    }
`;