import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useAuthContext } from '../../navigation/AuthProvider';
import Loading from '../../components/Loading';
import { useQuery } from '@apollo/client';
import { getTargetUser } from '../../apollo/TargetUser/targetUserQueries';
import IconAntD from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { getMessages } from '../../apollo/Message/messageQueries';
import MessagesComponent from '../../components/MessagesComponent'
import { messageCreated, messageDeleted } from '../../apollo/Message/messageSubscriptions';
import NewMessageForm from '../../components/NewMessageForm';
import MessageEditForm from '../../components/MessageEditForm';
import { useSelector } from 'react-redux';

const Messages = ({ route }) => {

    const { isDarkMode, userId } = useAuthContext();
    const { targetUserId } = route.params;
    const navigation = useNavigation();
    const [targetUser, setTargetUser] = useState({});
    const [messages, setMessages] = useState(null);
    const { message } = useSelector(state => state.messageInfoForEdit);
    const [messageForEdit, setMessageForEdit] = useState(null);

    const { data: getMessages_data, subscribeToMore: getMessages_subscribeToMore } = useQuery(getMessages, {
        variables: {
            chat_id: userId + "_" + targetUserId
        },
        fetchPolicy: 'network-only'
    });

    const { loading: getTargetUser_loading, data: getTargetUser_data } = useQuery(getTargetUser, {
        variables: {
            _id: targetUserId
        },
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (message) {
            setMessageForEdit(message);
        } else {
            setMessageForEdit(null);
        }
    }, [message]);

    useEffect(() => {

        if (getMessages_data) {
            setMessages(getMessages_data.messages);
        } else {
            setMessages(null);
        }

    }, [getMessages_data]);

    useEffect(() => {

        getMessages_subscribeToMore({
            document: messageCreated,
            variables: { chat_id: userId + "_" + targetUserId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const newMessageData = subscriptionData.data.messageCreated;

                return {
                    messages: [
                        ...prev.messages,
                        newMessageData
                    ]
                }
            }
        });

        getMessages_subscribeToMore({
            document: messageDeleted,
            variables: { chat_id: userId + "_" + targetUserId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const allMessages = prev.messages;
                const deletedMessage = subscriptionData.data.messageDeleted;
                const allMessagesData = allMessages.filter(message => message._id !== deletedMessage._id);

                return {
                    messages: allMessagesData
                }
            }
        });

    }, [getMessages_subscribeToMore])


    useEffect(() => {

        if (getTargetUser_data) {
            setTargetUser(getTargetUser_data.user);
        }

    }, [getTargetUser_data]);

    if (targetUser && !getTargetUser_loading) {
        return (
            <SafeAreaView className="h-full flex flex-col bg-white dark:bg-gray-700">

                <View
                    className={`w-full flex flex-row space-x-5 items-center p-2 border-b ${isDarkMode ? "border-slate-500" : "border-gray-200"}`}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("TargetUser", {
                        targetUserId: targetUserId
                    })} className="flex flex-row space-x-2 items-center">
                        <FastImage
                            className="w-12 h-12 rounded-full"
                            source={{
                                uri: targetUser.ImageUrl,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                        <View className="flex flex-col justify-center">
                            <Text className="text-black dark:text-white text-sm">
                                {targetUser.NickName}
                            </Text>
                            {targetUser.Name &&
                                <Text className="text-gray-400 dark:text-slate-500 text-sm">
                                    {targetUser.Name}
                                </Text>}
                        </View>
                    </TouchableOpacity>
                </View>

                <MessagesComponent messages={messages} />

                {!messageForEdit &&
                    <NewMessageForm targetUserId={targetUserId} />
                    ||
                    <MessageEditForm />}

            </SafeAreaView>
        )
    } else {
        return (
            <Loading />
        )
    }
}

export default Messages;