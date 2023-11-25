import { gql } from '@apollo/client';

export const commentLiked = gql`
    query($data: CreateCommentLikeInput!){
        commentLike(data: $data) {
            _id
        }
    }
`;