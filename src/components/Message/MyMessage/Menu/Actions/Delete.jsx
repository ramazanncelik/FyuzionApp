import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import IconE from 'react-native-vector-icons/Entypo'
import { useAuthContext } from '../../../../../navigation/AuthProvider'
import { useMutation } from '@apollo/client'
import { deleteMessage } from '../../../../../apollo/Message/messageMutations'
import CustomLoading from '../../../../CustomLoading'

const Delete = ({ message, setIsMenuVisible }) => {

    const { language, isDarkMode } = useAuthContext();
    const [removeMessage, { loading }] = useMutation(deleteMessage);

    const handleSubmit = async (type) => {
        if (type === "from me") {
            await removeMessage({
                variables: {
                    data: {
                        message_id: message._id,
                        type: type
                    }
                }
            })
        } else {
            await removeMessage({
                variables: {
                    data: {
                        type: type,
                        from: message.From,
                        to: message.To,
                        time: message.Time
                    }
                }
            })
        }
        await setIsMenuVisible(false);
    }

    if (!loading) {
        return (
            <View className="flex flex-1 flex-row h-max">
                <TouchableOpacity onPress={() => handleSubmit("from me")} className="flex flex-1 flex-col h-max justify-center items-center">
                    <IconE name="trash" color="red" size={24} />
                    <Text>
                        {language.includes("tr") ? "Benden" : "Me"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSubmit("all")} className="flex flex-1 flex-col h-max justify-center items-center">
                    <IconE name="trash" color="red" size={24} />
                    <Text>
                        {language.includes("tr") ? "Herkesten" : "All"}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <CustomLoading className={"w-[60%] flex-row h-max"} type={"pacman"} indicatorColor={isDarkMode ? "white" : "black"} indicatorSize={36} />
        )
    }
}

export default Delete