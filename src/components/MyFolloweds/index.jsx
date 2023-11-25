import { ScrollView, View, Text } from 'react-native'
import React from 'react'
import { language } from '../../utils/utils'
import Header from './Header'
import Remove from './Actions/Remove'

const MyFolloweds = ({ myFolloweds, setIsModalVisible }) => {
    return (
        <ScrollView className="w-full flex-1">
            {myFolloweds.length === 0 &&
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Takip ettiğiniz bir kullanıcı bulunamadı" : "Couldn't find a user you follow"}
                    </Text>
                </View>
                ||
                myFolloweds.map((myFollowed) => {
                    return (
                        <View key={myFollowed.toUser._id} className="w-full flex flex-row space-x-2 mb-3">
                            <Header myFollowedId={myFollowed.toUser._id} setIsModalVisible={setIsModalVisible} />
                            <Remove myFollowedId={myFollowed.toUser._id} />
                        </View>
                    )
                })}
        </ScrollView>
    )
}

export default MyFolloweds