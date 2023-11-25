import { gql } from '@apollo/client';

export const sharePost = gql`
    mutation($data: CreatePostInput!){
        createPost(data: $data)
    }
`;

export const updatePost = gql`
    mutation($post_id: ID!, $data: UpdatePostInput!){
        updatePost(post_id: $post_id, data: $data)
    }
`;

export const deletePost = gql`
    mutation($post_id: ID!){
        deletePost(post_id: $post_id)
    }
`;