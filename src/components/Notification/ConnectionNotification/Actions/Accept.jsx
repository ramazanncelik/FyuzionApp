import { View, TouchableOpacity, Text } from 'react-native'
import { useMutation } from '@apollo/client';
import { addNotification, removeNotification } from '../../../../apollo/Notification/notificationMutations';
import { getNotifications } from '../../../../apollo/Notification/notificationQueries';
import { language } from '../../../../utils/utils';
import { BallIndicator } from 'react-native-indicators'
import { addConnection } from '../../../../apollo/Connection/connectionMutation';
import { getCurrentUser } from '../../../../apollo/User/userQueries';
import { useAuthContext } from '../../../../navigation/AuthProvider';

const Accept = ({ notificationData }) => {

  const { userId } = useAuthContext();

  const notificationRefetchQueries = [
    { query: getNotifications, variables: { user_id: userId } }
  ];

  const [createConnection, { loading: addConnection_loading }] = useMutation(addConnection, {
    refetchQueries: [
      { query: getCurrentUser, variables: { _id: userId } }
    ]
  });

  const [createNotification, { loading: addNotification_loading }] = useMutation(addNotification, {
    refetchQueries: notificationRefetchQueries
  });

  const [deleteNotification, { loading: removeNotification_loading }] = useMutation(removeNotification, {
    refetchQueries: notificationRefetchQueries
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

    await createConnection({
      variables: {
        data: {
          From: notificationData.From,
          To: userId
        }
      }
    });

    await createNotification({
      variables: {
        data: {
          From: notificationData.From,
          To: userId,
          Type: "follower",
          Date: today,
          Time: time,
        }
      }
    });

    await setTimeout(async () => {
      await deleteNotification({
        variables: {
          notification_id: notificationData._id
        }
      });
    }, 1000);
  }

  if (!addConnection_loading && !addNotification_loading && !removeNotification_loading) {
    return (
      <TouchableOpacity onPress={() => handleSubmit()} className="px-4 py-1 bg-blue-500 items-center justify-center rounded mb-2">
        <Text className="text-white text-sm">
          {language.includes("tr") ? "Onayla" : "Accept"}
        </Text>
      </TouchableOpacity>
    )
  } else {
    return (
      <View className="px-8 py-2 border border-blue-500 items-center justify-center rounded mb-2">
        <BallIndicator size={16} color={"#3b82f6"} />
      </View>
    )
  }
}

export default Accept