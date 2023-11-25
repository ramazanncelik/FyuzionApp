import { gql } from '@apollo/client';

export const addComplaint = gql`
    mutation($data: CreateComplaintInput!){
        createComplaint(data: $data)
    }
`;

export const deleteComplaint = gql`
    mutation($complaint_id: ID!){
        deleteComplaint(complaint_id: $complaint_id)
    }
`;