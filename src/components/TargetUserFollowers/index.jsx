import { ScrollView, View, Text } from 'react-native'
import { language } from '../../utils/utils'
import Header from './Header'
import Connection from './Actions/Connection'
import { useAuthContext } from '../../navigation/AuthProvider'

const TargetUserFollowers = ({ targetUserFollowers, setIsModalVisible }) => {

    const { userId } = useAuthContext();

    return (
        <ScrollView className="w-full flex-1">
            {targetUserFollowers.length === 0 &&
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Kullanıcı henüz kimseyi takip etmemektedir." : "The user is not following anyone yet."}
                    </Text>
                </View>
                ||
                targetUserFollowers.map((targetUserFollower) => {
                    return (
                        <View key={targetUserFollower.fromUser._id} className="w-full flex flex-row space-x-2 mb-3">
                            <Header targetUserFollowerId={targetUserFollower.fromUser._id} setIsModalVisible={setIsModalVisible} />
                            {userId !== targetUserFollower.fromUser._id &&
                                <Connection targetUserFollowerId={targetUserFollower.fromUser._id} />}
                        </View>
                    )
                })}
        </ScrollView>
    )
}

export default TargetUserFollowers