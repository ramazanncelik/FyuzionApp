import { gql } from '@apollo/client';

export const getTargetUserPosts = gql`
  query($user_id: ID!){
      posts(user_id: $user_id) {
          _id
          Time
      }
  }
`;