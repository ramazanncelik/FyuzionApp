import { SafeAreaView, View, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { getNotifications } from '../../apollo/Notification/notificationQueries';
import { useAuthContext } from '../../navigation/AuthProvider';
import Loading from '../../components/Loading';
import IconAntD from 'react-native-vector-icons/AntDesign'
import { language } from '../../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { notificationCreated } from '../../apollo/Notification/notificationSubscriptions';
import Notification from '../../components/Notification';

const Notifications = () => {

  const { userId, isDarkMode } = useAuthContext();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(null)

  const { data, subscribeToMore, refetch } = useQuery(getNotifications, {
    variables: {
      user_id: userId
    }
  });

  const renderItem = ({ item }) => (
    <React.Fragment>
      <Notification notificationData={item} />
    </React.Fragment>
  );

  useEffect(() => {
    refetch({
      user_id: userId
    });
  }, [userId]);

  useEffect(() => {
    if (data) {
      const list = [];
      Object.assign(list, data.notifications);
      list.sort((a, b) => { return (b.Time) - (a.Time) });
      setNotifications(list);
    } else {
      setNotifications(null);
    }
  }, [data]);

  useEffect(() => {

    subscribeToMore({
      document: notificationCreated,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newNotification = subscriptionData.data.notificationCreated;
        return {
          notifications: [
            ...prev.notifications,
            newNotification
          ],
        };
      },
      onError: (err) => {
        console.log(err);
      }
    })

  }, [subscribeToMore]);

  if (notifications) {
    return (
      <SafeAreaView className="h-full flex flex-col space-y-2 bg-white dark:bg-gray-700 px-2 pt-2">
        <TouchableOpacity onPress={() => navigation.goBack()}
          className="flex-row gap-3 items-center mb-2">
          <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
          <Text className="text-lg text-black dark:text-white">
            {language.includes("tr") ? "Bildirimler" : "Notifications"}
          </Text>
        </TouchableOpacity>

        {notifications.length !== 0 &&
          <FlatList className="w-full px-2"
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
          ||
          <View className="w-full p-2 bg-blue-200 rounded-lg">
            <Text className="text-blue-700">
              {language.includes("tr") ? "Bildiriminiz bulunmamaktadır" : "You have no notification"}
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

export default Notifications