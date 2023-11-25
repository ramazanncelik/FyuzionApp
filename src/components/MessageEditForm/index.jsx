import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import store from '../../store';
import { setMessage } from '../../store/messageInfoForEdit';
import { useAuthContext } from '../../navigation/AuthProvider';
import { useMutation } from '@apollo/client';
import { updateMessage } from '../../apollo/Message/messageMutations';
import CustomLoading from '../CustomLoading';
import IconII from 'react-native-vector-icons/Ionicons'

const MessageEditForm = () => {

    const { language, isDarkMode } = useAuthContext();
    const [newDescription, setNewDescription] = useState("")
    const { message } = useSelector(state => state.messageInfoForEdit);
    const [editMessage, { loading }] = useMutation(updateMessage);

    const handleSubmit = async () => {
        if (newDescription !== "") {
            if (message.Description !== newDescription) {
                await editMessage({
                    variables: {
                        data: {
                            from: message.From,
                            to: message.To,
                            time: message.Time,
                            Description: newDescription
                        }
                    }
                });
                await store.dispatch(setMessage(false))
            } else {
                await store.dispatch(setMessage(false))
            }
        }
    }

    useEffect(() => {
        if (message) {
            setNewDescription(message.Description);
        } else {
            setNewDescription("");
        }
    }, [message]);

    return (
        <View className={`w-full flex flex-row h-max space-x-2 items-center p-2 border-t ${isDarkMode ? "border-slate-500" : "border-gray-200"}`}>

            <TouchableOpacity onPress={() => store.dispatch(setMessage(false))} disabled={loading}>
                <IconII name="arrow-back" color={isDarkMode ? "white" : "black"} size={24} />
            </TouchableOpacity>

            <TextInput
                inputMode="text"
                className="flex-1 bg-white mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={language.includes("tr") ? "Yeni Açıklama" : "New Description"}
                onChangeText={value => setNewDescription(value)}
                keyboardType="email-address"
                value={newDescription}
            />

            {loading ?
                <CustomLoading type={"pacman"} indicatorSize={16} indicatorColor={"white"} className={"bg-blue-500 px-4 ml-2 rounded-lg items-center justify-center"} />
                :
                <TouchableOpacity onPress={() => handleSubmit()} disabled={!newDescription} className="py-3 px-5 rounded-lg bg-blue-500 items-center justify-center">
                    <Text className="text-white font-bold">
                        {language.includes("tr") ? "Onayla" : "Confirm"}
                    </Text>
                </TouchableOpacity>}

        </View>
    )
}

export default MessageEditForm