import { gql } from '@apollo/client';

export const addConnection = gql`
    mutation($data: CreateConnectionInput!) {
        createConnection(data: $data)
    }
`;

export const removeConnection = gql`
    mutation($connection_id: ID!) {
        deleteConnection(connection_id: $connection_id)
    }
`;