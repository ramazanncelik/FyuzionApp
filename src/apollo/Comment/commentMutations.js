import { gql } from '@apollo/client';

export const createComment = gql`
    mutation($data: CreateCommentInput!) {
        createComment(data: $data)
    }
`;

export const deleteComment = gql`
    mutation($comment_id: ID!) {
        deleteComment(comment_id: $comment_id)
    }
`;

export const deleteAllComment = gql`
    mutation($post_id: ID!) {
        deleteAllComment(post_id: $post_id)
    }
`;