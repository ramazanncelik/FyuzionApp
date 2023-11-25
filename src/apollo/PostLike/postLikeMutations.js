import { gql } from '@apollo/client';

export const addPostLike = gql`
    mutation($data: CreatePostLikeInput!){
        createPostLike(data: $data)
    }
`;

export const deletePostLike = gql`
    mutation($like_id: ID!){
        deletePostLike(like_id: $like_id)
    }
`;

export const deleteAllPostLike = gql`
    mutation($post_id: ID!){
        deleteAllPostLike(post_id: $post_id)
    }
`;