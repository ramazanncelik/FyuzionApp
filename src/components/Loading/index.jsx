import { SafeAreaView } from 'react-native'
import React from 'react'
import { BallIndicator } from 'react-native-indicators';
import { useAuthContext } from '../../navigation/AuthProvider';

const Loading = () => {

    const { isDarkMode } = useAuthContext();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-700 px-2 pt-2 items-center justify-center">
            <BallIndicator color={isDarkMode ? "white" : "black"} size={36} />
        </SafeAreaView>
    )
}

export default Loading;