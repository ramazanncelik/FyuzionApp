import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { getMessage } from '../../apollo/Message/messageQueries'
import { useAuthContext } from '../../navigation/AuthProvider'
import MyMessage from './MyMessage'
import TargetUserMessage from './TargetUserMessage'
import CustomLoading from '../CustomLoading'
import { messageUpdated } from '../../apollo/Message/messageSubscriptions'

const Message = ({ messageId }) => {

    const { userId, isDarkMode } = useAuthContext();
    const [message, setMessage] = useState(null);

    const { loading, data, subscribeToMore } = useQuery(getMessage, {
        variables: { message_id: messageId },
        fetchPolicy: "network-only"
    });

    useEffect(() => {

        subscribeToMore({
            document: messageUpdated,
            variables: { message_id: messageId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const updatedMessage = subscriptionData.data.messageUpdated;

                return {
                    message: updatedMessage
                }
            }
        });

    }, [subscribeToMore])

    useEffect(() => {
        
        if (data) {
            if (data.message) {
                setMessage(data.message);
            } else {
                setMessage(null);
            }
        } else {
            setMessage(null);
        }

    }, [data])

    if (!loading && message) {
        if (message.fromUser._id === userId) {
            return (
                <MyMessage message={message} />
            )
        } else {
            return (
                <TargetUserMessage message={message} />
            )
        }
    } else {
        return (
            <CustomLoading type={"ball"} indicatorSize={24} indicatorColor={isDarkMode ? "white" : "black"} className={"w-full py-3 border border-gray-300 dark:border-slate-500 my-1 rounded-lg"} />
        )
    }
}

export default Message