import { ScrollView, View, Text } from 'react-native'
import { language } from '../../utils/utils'
import Header from './Header'
import Connection from './Actions/Connection'
import { useAuthContext } from '../../navigation/AuthProvider'

const TargetUserFolloweds = ({ targetUserFolloweds,setIsModalVisible }) => {

    const { userId } = useAuthContext();

    return (
        <ScrollView className="w-full flex-1">
            {targetUserFolloweds.length === 0 &&
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Kullanıcı henüz kimseyi takip etmemektedir." : "The user is not following anyone yet."}
                    </Text>
                </View>
                ||
                targetUserFolloweds.map((targetUserFollowed) => {
                    return (
                        <View key={targetUserFollowed.toUser._id} className="w-full flex flex-row space-x-2 mb-3">
                            <Header targetUserFollowedId={targetUserFollowed.toUser._id} setIsModalVisible={setIsModalVisible} />
                            {userId !== targetUserFollowed.toUser._id &&
                                <Connection targetUserFollowedId={targetUserFollowed.toUser._id} />}
                        </View>
                    )
                })}
        </ScrollView>
    )
}

export default TargetUserFolloweds