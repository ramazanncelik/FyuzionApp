import { View, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../navigation/AuthProvider'
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import IconAntD from 'react-native-vector-icons/AntDesign'
import IconE from 'react-native-vector-icons/Entypo'
import { language } from '../../utils/utils';
import { useMutation, useQuery } from '@apollo/client';
import { getChat, getChats } from '../../apollo/Chat/chatQueries';
import { chatUpdated } from '../../apollo/Chat/chatSubscriptions';
import { deleteChat } from '../../apollo/Chat/chatMutations';
import CustomLoading from '../CustomLoading';

const Chat = ({ chatId }) => {

    const { userId, isDarkMode } = useAuthContext();
    const navigation = useNavigation();
    const [chatData, setChatData] = useState(null);

    const { data: getChat_data, subscribeToMore: getChat_subscribeToMore } = useQuery(getChat, {
        variables: { chat_id: chatId }
    });

    const [removeChat, { loading: deleteChat_loading }] = useMutation(deleteChat);

    const handleDelete = async () => {
        await removeChat({
            variables: {
                chat_id: chatId
            }
        });
    }

    useEffect(() => {
        if (getChat_data) {
            setChatData(getChat_data.chat);
        }
    }, [getChat_data]);

    useEffect(() => {

        getChat_subscribeToMore({
            document: chatUpdated,
            variables: { chat_id: chatId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return {
                    chat: {
                        ...prev.chat,
                        ...subscriptionData.data.chatUpdated
                    }
                }
            }
        })

    }, [getChat_subscribeToMore])


    if (chatData && !deleteChat_loading) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("Messages", {
                targetUserId: chatData.toUser._id
            })} className={`w-full p-2 rounded-lg border flex flex-row space-x-2 items-center mt-2 ${isDarkMode ? "border-slate-500" : "border-gray-300"}`}>

                <FastImage
                    className="w-12 h-12 rounded-full"
                    source={{
                        uri: chatData.toUser.ImageUrl,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />

                <View className="flex-1 flex-col">
                    <Text className={`${isDarkMode ? "text-white" : "text-black"}`}>{chatData.toUser.NickName}</Text>
                    {chatData.Type === "text" &&
                        (
                            chatData.lastMessageOwner._id == userId ?
                                <Text className={`${isDarkMode ? "text-white" : "text-black"}`}>
                                    {language.includes("tr") ? `Sen: ${chatData.LastMessage}` : `You: ${chatData.LastMessage}`}
                                </Text>
                                :
                                <Text className={`${isDarkMode ? "text-white" : "text-black"}`}>
                                    {`${chatData.lastMessageOwner.NickName}: ${chatData.LastMessage}`}
                                </Text>
                        )
                        ||
                        (chatData.lastMessageOwner._id === userId ?
                            <Text className={`flex flex-row ${isDarkMode ? "text-white" : "text-black"}`}>
                                {language.includes("tr") ? `Sen: ` : `You: `}
                                <IconAntD name="file1" size={16} color={isDarkMode ? "white" : "black"} />
                            </Text>
                            :
                            <Text className={`flex flex-row ${isDarkMode ? "text-white" : "text-black"}`}>
                                {language.includes("tr") ? `Sen: ` : `You: `}
                                <IconAntD name="file1" size={16} color={isDarkMode ? "white" : "black"} />
                            </Text>)
                    }
                </View>

                <TouchableOpacity onPress={() => handleDelete()}>
                    <IconE name="trash" size={24} color={"red"} />
                </TouchableOpacity>

            </TouchableOpacity>
        )
    } else {
        return (
            <CustomLoading type={"ball"} indicatorSize={24} indicatorColor={isDarkMode ? "white" : "black"} className={"w-full py-3 border border-gray-300 dark:border-slate-500 mt-2 rounded-lg"} />
        )
    }
}

export default Chat