import { gql } from '@apollo/client';

export const addNotification = gql`
    mutation($data: CreateNotificationInput!) {
        createNotification(data: $data)
    }
`;

export const removeNotification = gql`
    mutation($notification_id: ID!){
        deleteNotification(notification_id: $notification_id)
    }
`;