import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { language } from '../../../utils/utils';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import { useMutation } from '@apollo/client';
import { updateUser } from '../../../apollo/User/userMutations';
import { useAuthContext } from '../../../navigation/AuthProvider';
import { BallIndicator } from 'react-native-indicators'

const ChangeIsPrivate = () => {

    const { userId, user, isDarkMode } = useAuthContext();
    const [isPrivate, setIsPrivate] = useState(user.IsPrivate);

    const [changeUserData, { loading }] = useMutation(updateUser);

    const handleSubmit = async () => {
        await changeUserData({
            variables: {
                _id: userId,
                data: {
                    IsPrivate: !isPrivate
                }
            }
        });
    }

    useEffect(() => {
        if (user) {
            setIsPrivate(user.IsPrivate);
        }
    }, [user])


    if (!loading) {
        if (isPrivate) {
            return (
                <TouchableOpacity disabled={loading}
                    className="w-full px-2 py-3 border-b border-gray-300 dark:border-gray-400 flex flex-row space-x-3 items-center"
                    onPress={() => handleSubmit()}>
                    <IconMCI name="account-lock-outline" size={28} color={isDarkMode ? "white" : "black"} />

                    <Text className="text-black dark:text-white">
                        {language.includes("tr") ? "Hesabı Herkese Açık Yap" : "Make Account Public"}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity disabled={loading}
                    className="w-full px-2 py-3 border-b border-gray-300 dark:border-gray-400 flex flex-row space-x-3 items-center"
                    onPress={() => handleSubmit()}>
                    <IconMCI name="account-lock-open-outline" size={28} color={isDarkMode ? "white" : "black"} />

                    <Text className="text-black dark:text-white">
                        {language.includes("tr") ? "Hesabı Gizle" : "Hide Account"}
                    </Text>
                </TouchableOpacity>
            )
        }
    } else {
        return (
            <View
                className="w-full p-7 border-b border-gray-300 dark:border-gray-400 items-center justify-center">
                <BallIndicator size={16} color={isDarkMode ? "white" : "black"} />
            </View>
        )
    }
}

export default ChangeIsPrivate;