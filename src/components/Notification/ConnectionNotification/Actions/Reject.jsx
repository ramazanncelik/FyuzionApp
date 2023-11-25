import { Text, TouchableOpacity, View } from 'react-native'
import { useMutation } from '@apollo/client'
import { removeNotification } from '../../../../apollo/Notification/notificationMutations'
import { getNotifications } from '../../../../apollo/Notification/notificationQueries'
import { BallIndicator } from 'react-native-indicators'
import { language } from '../../../../utils/utils'
import { useAuthContext } from '../../../../navigation/AuthProvider'

const Reject = ({ notificationData }) => {

  const {isDarkMode} = useAuthContext();

  const [deleteNotification, { loading }] = useMutation(removeNotification, {
    refetchQueries: [
      { query: getNotifications, variables: { user_id: notificationData.To } }
    ]
  });

  const handleSubmit = async () => {
    await deleteNotification({
      variables: {
        notification_id: notificationData._id
      }
    });
  }

  if (!loading) {
    return (
      <TouchableOpacity onPress={() => handleSubmit()} className="px-4 py-1 bg-gray-400 items-center justify-center rounded">
        <Text className="text-white text-sm">
          {language.includes("tr") ? "Reddet" : "Reject"}
        </Text>
      </TouchableOpacity>
    )
  } else {
    return (
      <View className="px-8 py-2 border border-black dark:border-white items-center justify-center rounded">
        <BallIndicator size={16} color={isDarkMode ? "white" : "black"} />
      </View>
    )
  }
}

export default Reject