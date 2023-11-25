import { ScrollView, View, Text } from 'react-native'
import React from 'react'
import { language } from '../../utils/utils'
import Header from './Header'
import Connection from './Actions/Connection'
import Remove from './Actions/Remove'

const Followers = ({ followers,setIsModalVisible }) => {
    return (
        <ScrollView className="w-full flex-1">
            {followers.length === 0 &&
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Takipçi bulunamadı" : "No follower found"}
                    </Text>
                </View>
                ||
                followers.map((follower) => {
                    return (
                        <View key={follower.fromUser._id} className="w-full flex flex-row space-x-2 mb-3">
                                <Header followerId={follower.fromUser._id} setIsModalVisible={setIsModalVisible} />
                                <View className="flex flex-col justify-center items-center">
                                    <Connection followerId={follower.fromUser._id} />
                                    <Remove followerId={follower.fromUser._id} />
                                </View>
                        </View>
                    )
                })}
        </ScrollView>
    )
}

export default Followers