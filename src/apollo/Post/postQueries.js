import { gql } from '@apollo/client';

export const getPosts = gql`
  query($user_id: ID!){
      posts(user_id: $user_id) {
          _id
          Time
      }
  }
`;

export const getPost = gql`
    query($_id: ID!) {
        post(_id: $_id) {
            _id
            Description
            Files {
                FilePath
                FileName
                FileType
                FileUrl
            }
            user {
              _id
              NickName
              Name
              ImageUrl
            }
            Date
            Time
          }
    }
`;

export const getPostCommentIsClosed = gql`
    query($_id: ID!) {
        post(_id: $_id) {
            _id
            CommentsIsClosed
        }
    }
`;

export const getPostActions = gql`
    query($_id: ID!) {
        post(_id: $_id) {
            _id
            Like
            Comment
        }
    }
`;