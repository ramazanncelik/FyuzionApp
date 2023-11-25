import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { language } from '../../../utils/utils'
import { useNavigation } from '@react-navigation/native'

const Message = ({ targetUserId }) => {

    const navigation = useNavigation();

    const goChat = async () => {
        navigation.navigate("Messages", {
            targetUserId: targetUserId
        })
    }

    return (
        <TouchableOpacity onPress={() => goChat()} className="flex-1 h-max items-center justify-center h-max bg-blue-500 rounded-lg">
            <Text className="text-sm text-white font-bold">
                {language.includes("tr") ? "Mesajlaş" : "Message"}
            </Text>
        </TouchableOpacity>
    )
}

export default Message