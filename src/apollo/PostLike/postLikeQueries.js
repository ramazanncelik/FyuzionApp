import { gql } from '@apollo/client';

export const postLiked = gql`
    query($data: CreatePostLikeInput!){
        postLike(data: $data) {
            _id
        }
    }
`;