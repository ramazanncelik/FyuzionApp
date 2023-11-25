import { gql } from '@apollo/client';

export const addCommentLike = gql`
    mutation($data: CreateCommentLikeInput!){
        createCommentLike(data: $data)
    }
`;

export const deleteCommentLike = gql`
    mutation($like_id: ID!){
        deleteCommentLike(like_id: $like_id)
    }
`;

export const deleteAllCommentLike = gql`
    mutation($comment_id: ID!){
        deleteAllCommentLike(comment_id: $comment_id)
    }
`;