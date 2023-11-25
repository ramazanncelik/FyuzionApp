import { Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { language } from '../../../utils/utils';
import { addNotification, removeNotification } from '../../../apollo/Notification/notificationMutations';
import { AuthContext } from '../../../navigation/AuthProvider';
import { getNotification } from '../../../apollo/Notification/notificationQueries';
import { getConnection } from '../../../apollo/Connection/connectionQeries';
import { BallIndicator } from 'react-native-indicators'
import { removeConnection } from '../../../apollo/Connection/connectionMutation';
import { getCurrentUser } from '../../../apollo/User/userQueries';
import { getTargetUser } from '../../../apollo/TargetUser/targetUserQueries';

const Connection = ({ targetUserFollowedId }) => {

    const { userId } = useContext(AuthContext);
    const [notificationId, setNotificationId] = useState(null)
    const [connectionId, setConnectionId] = useState(null)

    const addNotificationRefetchQueries = [
        {
            query: getNotification, variables: {
                data: {
                    From: userId,
                    To: targetUserFollowedId,
                    Type: "connection"
                }
            }
        }
    ]

    const [createNotification, { loading: addNotification_loading }] = useMutation(addNotification, {
        refetchQueries: addNotificationRefetchQueries
    });
    const [deleteNotification, { loading: removeNotification_loading }] = useMutation(removeNotification, {
        refetchQueries: addNotificationRefetchQueries
    });

    const [deleteConnection, { loading: removeConnection_loading }] = useMutation(removeConnection, {
        refetchQueries: [
            {
                query: getConnection, variables: {
                    data: {
                        From: userId,
                        To: targetUserFollowedId,
                    }
                }
            },
            {
                query: getCurrentUser, variables: {
                    _id: userId
                }
            },
            {
                query: getTargetUser, variables: {
                    _id: targetUserFollowedId
                }
            }
        ]
    });

    const { loading: getNotification_loading, data: getNotification_data, refetch: getNotification_refetch } = useQuery(getNotification, {
        variables: {
            data: {
                From: userId,
                To: targetUserFollowedId,
                Type: "connection"
            }
        }
    });

    const { loading: getConnection_loading, data: getConnection_data, refetch: getConnection_refetch } = useQuery(getConnection, {
        variables: {
            data: {
                From: userId,
                To: targetUserFollowedId
            }
        }
    });

    const handleSubmit = async () => {
        const today = new Date();

        const time = today.getFullYear() + "" +
            (today.getMonth() < 10 ? ("0" + today.getMonth()) : today.getMonth())
            + "" +
            (today.getDate() < 10 ? ("0" + today.getDate()) : today.getDate())
            + "" +
            (today.getHours() < 10 ? ("0" + today.getHours()) : today.getHours())
            + "" +
            (today.getMinutes() < 10 ? ("0" + today.getMinutes()) : today.getMinutes())
            + "" +
            (today.getSeconds() < 10 ? ("0" + today.getSeconds()) : today.getSeconds())
            + "" +
            (today.getMilliseconds() < 10 ? ("0" + today.getMilliseconds()) : today.getMilliseconds());

        if (connectionId) {
            await deleteConnection({
                variables: {
                    connection_id: connectionId
                }
            })
        } else {
            if (notificationId) {
                await deleteNotification({
                    variables: {
                        notification_id: notificationId
                    }
                });
            } else {
                await createNotification({
                    variables: {
                        data: {
                            From: userId,
                            To: targetUserFollowedId,
                            Type: "connection",
                            Date: today,
                            Time: time,
                        }
                    }
                });
            }
        }
    }

    useEffect(() => {
        if (getNotification_data) {
            if (getNotification_data.notification) {
                setNotificationId(getNotification_data.notification._id)
            } else {
                setNotificationId(null)
            }
        }
    }, [getNotification_data]);

    useEffect(() => {
        if (getConnection_data) {
            if (getConnection_data.connection) {
                setConnectionId(getConnection_data.connection._id)
            } else {
                setConnectionId(null)
            }
        }
    }, [getConnection_data]);

    useEffect(() => {
        getNotification_refetch({
            data: {
                From: userId,
                To: targetUserFollowedId,
                Type: "connection"
            }
        });
    }, [getNotification_refetch]);

    useEffect(() => {
        getConnection_refetch({
            data: {
                From: userId,
                To: targetUserFollowedId
            }
        });
    }, [getConnection_refetch]);

    return (
        <>
            {connectionId ?
                ((getConnection_loading || removeConnection_loading) &&
                    <View
                        className="p-3 items-center justify-center bg-blue-500 rounded-lg mb-1">
                        <BallIndicator size={20} color="white" />
                    </View>
                    ||
                    <TouchableOpacity
                        disabled={getConnection_loading || removeConnection_loading}
                        onPress={() => handleSubmit()}
                        className="p-2 items-center justify-center bg-blue-500 rounded-lg mb-1">
                        <Text className=" font-bold text-white">
                            {language.includes("tr") ? "Takibi Bırak" : "Stop Following"}
                        </Text>
                    </TouchableOpacity>)
                :
                ((getNotification_loading || addNotification_loading || removeNotification_loading) &&
                    <View
                        className="p-3 items-center justify-center bg-blue-500 rounded-lg mb-1">
                        <BallIndicator size={20} color="white" />
                    </View>
                    ||
                    <TouchableOpacity
                        disabled={getNotification_loading || addNotification_loading || removeNotification_loading}
                        onPress={() => handleSubmit()}
                        className="p-2 items-center justify-center bg-blue-500 rounded-lg mb-1">
                        {notificationId ?
                            <Text className="text-sm font-bold text-white">
                                {language.includes("tr") ? "İsteği Geri Çek" : "Withdraw Request"}
                            </Text> :
                            <Text className="text-sm font-bold text-white">
                                {language.includes("tr") ? "Takip Et" : "Follow"}
                            </Text>}
                    </TouchableOpacity>)}
        </>
    )
}

export default Connection