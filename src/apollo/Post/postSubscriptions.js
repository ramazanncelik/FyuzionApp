import { gql } from '@apollo/client';

export const postCreated = gql`
    subscription($user_id: ID!){
        postCreated(user_id: $user_id) {
            _id
            Time
        }
    }
`;

export const postDeleted = gql`
    subscription($user_id: ID!){
        postDeleted(user_id: $user_id) {
            _id
        }
    }
`;