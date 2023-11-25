import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import IconE from 'react-native-vector-icons/Entypo'
import { useAuthContext } from '../../../../../navigation/AuthProvider'
import { useMutation } from '@apollo/client'
import { deleteMessage } from '../../../../../apollo/Message/messageMutations'

const Delete = ({ message, setIsMenuVisible }) => {

    const { language } = useAuthContext();
    const [removeMessage, { loading }] = useMutation(deleteMessage);

    const handleSubmit = async () => {
        await removeMessage({
            variables: {
                data: {
                    message_id: message._id,
                    type: "from me"
                }
            }
        })
    }

    return (
        <TouchableOpacity onPress={() => handleSubmit()} className="flex-1 flex-col h-max justify-center items-center">
            <IconE name="trash" color="red" size={24} />
            <Text>
                {language.includes("tr") ? "Benden" : "Me"}
            </Text>
        </TouchableOpacity>
    )
}

export default Delete