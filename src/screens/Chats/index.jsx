import { SafeAreaView, View, TouchableOpacity, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import IconAntD from 'react-native-vector-icons/AntDesign'
import { useAuthContext } from '../../navigation/AuthProvider'
import { useNavigation } from '@react-navigation/native'
import { language } from '../../utils/utils'
import { useQuery } from '@apollo/client'
import { getChats } from '../../apollo/Chat/chatQueries'
import Loading from '../../components/Loading'
import Chat from '../../components/Chat'
import { chatCreated, chatDeleted } from '../../apollo/Chat/chatSubscriptions'

const Chats = () => {

  const { userId, isDarkMode } = useAuthContext();
  const navigation = useNavigation();
  const [chats, setChats] = useState(null)

  const { loading: getChats_loading, data: getChats_data, subscribeToMore: getChats_subscribeToMore } = useQuery(getChats, {
    variables: {
      user_id: userId
    },
    fetchPolicy:'network-only'
  });

  const renderItem = ({ item }) => (
    <React.Fragment>
      <Chat chatId={item._id} />
    </React.Fragment>
  );

  useEffect(() => {
    if (getChats_data) {
      setChats(getChats_data.chats);
    } else {
      setChats(null)
    }
  }, [getChats_data]);

  useEffect(() => {

    getChats_subscribeToMore({
      document: chatCreated,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newChat = subscriptionData.data.chatCreated;
        
        return {
          chats: [
            ...prev.chats,
            newChat
          ]
        }
      }
    });

    getChats_subscribeToMore({
      document: chatDeleted,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const allChats = prev.chats;
          const deletedChat = subscriptionData.data.chatDeleted;
          const allChatsData = allChats.filter(chat => chat._id !== deletedChat._id);

          return {
              chats: allChatsData
          }
      }
  });

  }, [getChats_subscribeToMore]);


  if (!getChats_loading && chats) {
    return (
      <SafeAreaView className="h-full flex flex-col bg-white dark:bg-gray-700 pt-2 px-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex flex-row space-x-2 items-center">
          <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
          <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
            {language.includes("tr") ? "Geri" : "Back"}
          </Text>
        </TouchableOpacity>

        {chats.length !== 0 &&
          <FlatList className="flex-1"
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
          ||
          <View className="w-full p-3 mt-2 bg-blue-200 rounded-lg">
            <Text className="text-blue-700">
              {language.includes("tr") ? "Sohbet bulunmamaktadır" : "You have no chat"}
            </Text>
          </View>}

      </SafeAreaView>
    )
  } else {
    return (
      <Loading />
    )
  }
}

export default Chats