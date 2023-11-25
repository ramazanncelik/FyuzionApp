import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Loading from '../Loading'
import { language } from '../../utils/utils'
import Message from '../Message'

const MessagesComponent = ({ messages }) => {

    const renderItem = ({ item }) => (
        <React.Fragment>
            <Message messageId={item._id} />
        </React.Fragment>
    );

    if (messages) {
        return (
            <View className="flex-1 px-2">
                {messages.length !== 0 &&
                    <FlatList className="flex-1"
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    />
                    ||
                    <View className="w-full p-3 bg-blue-200 rounded-lg mt-1">
                        <Text className="text-blue-700">
                            {language.includes("tr") ? "Mesaj bulunmamaktadır." : "There are no messages."}
                        </Text>
                    </View>}
            </View>
        )
    } else {
        return (
            <Loading />
        )
    }
}

export default MessagesComponent