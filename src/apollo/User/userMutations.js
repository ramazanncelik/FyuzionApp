import { gql } from '@apollo/client'

export const addUser = gql`
    mutation($data: CreateUserInput!){
        createUser(data: $data) {
            emailExist,
            nickNameExist,
            success
        }
    }
`;

export const updateUser = gql`
    mutation($_id: ID!, $data: UpdateUserInput!) {
        updateUser(_id: $_id, data: $data) {
            nickNameExist
            success
        }
    }
`;

export const createResetPasswordMail = gql`
    mutation($data: CreateMailInput!){
        createResetPasswordMail(data: $data)
    }
`;

export const createEmailVerifyMail = gql`
    mutation($data: CreateMailInput!){
        createEmailVerifyMail(data: $data)
    }
`;