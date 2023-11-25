import { gql } from '@apollo/client';

export const targetUserFragment = gql`
    fragment targetUserFragment on User{
        _id
        NickName
        Name
        Biography
        Follower
        ImageUrl
        MyFollowed
        IsPrivate
        Website
    }
`;

export const getTargetUser = gql`
    query($_id: ID!) {
        user(_id: $_id) {
            ...targetUserFragment
        }
    } 
    ${targetUserFragment}
`;