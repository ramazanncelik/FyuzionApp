import { gql } from "@apollo/client";

export const getComments = gql`
    query($post_id: ID!){
        comments(post_id: $post_id) {
            _id
            OwnerId
        }
    }
`;

export const getComment = gql`
    query($_id: ID!){
        comment(_id: $_id) {
            _id
            OwnerId
            PostId
            Description
            Like
            Date
            Time
            user {
                _id
                ImageUrl
                NickName
                Name
            }
        }
      }
`;