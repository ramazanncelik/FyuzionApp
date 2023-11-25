import { gql } from '@apollo/client';

export const userUpdated = gql`
    subscription($user_id: ID!){
        userUpdated(user_id: $user_id) {
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
    }
`;