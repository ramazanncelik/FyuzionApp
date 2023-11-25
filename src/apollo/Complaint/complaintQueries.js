import { gql } from '@apollo/client';

export const getComplaints = gql`
    query($post_id: ID!){
        complaints(post_id: $post_id) {
            _id
        }
    }
`;

export const getComplaint = gql`
    query($complaint_id: ID!){
        complaint(complaint_id: $complaint_id) {
            _id
            User
            Title
            Description
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