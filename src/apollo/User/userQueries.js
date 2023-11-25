import { gql } from '@apollo/client'

export const login = gql`
    query($data: LoginInput!){
        login(data: $data) {
          _id
        }
    }
`;

export const userFragment = gql`
    fragment UserFragment on User{
        _id
        Email
        NickName
        Name
        Password
        Biography
        Website
        PhoneNumber
        Follower
        ImageUrl
        MyFollowed
        OnlineStatus
        EmailVerify
        IsPrivate
    }
`;

export const getCurrentUser = gql`
    query($_id: ID!) {
        user(_id: $_id) {
            ...UserFragment
        }
    } 
    ${userFragment}
`;

export const getCurrentUserSubscription = gql`
    subscription($user_id: ID!){
        userUpdated(user_id: $user_id) {
            ...UserFragment
        }
    } 
    ${userFragment}
`;

export const getAllUser = gql`
    query{
        users {
            _id
            NickName
            Name
            ImageUrl
            IsPrivate
        }
    }
`;