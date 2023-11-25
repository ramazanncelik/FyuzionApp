import { gql } from '@apollo/client';

export const getFollowers = gql`
    query getFollowers($user_id: ID!) {
        followers(user_id: $user_id) {
            _id
            From
            To
            fromUser{
                _id
                NickName
                Name
                ImageUrl
            }
        }
    } 
`;

export const getMyFolloweds = gql`
    query getMyFolloweds($user_id: ID!) {
        myFolloweds(user_id: $user_id) {
            _id
            From
            To
            toUser{
                _id
                NickName
                Name
                ImageUrl
            }
        }
    }
`;

export const getConnection = gql`
    query getConnection($data: CreateConnectionInput!) {
        connection(data: $data) {
            _id
        }
    }
`;