import { View, Text } from 'react-native'
import React from 'react'
import { useAuthContext } from '../../../../navigation/AuthProvider'
import Copy from './Actions/Copy';
import Delete from './Actions/Delete';

const TargetUserMessageMenu = ({ message, setIsMenuVisible }) => {

    const { language } = useAuthContext();

    return (
        <View className="w-full flex flex-row items-center justify-start my-1">

            <View className="w-[75%] flex flex-col space-y-1 px-2 py-1 bg-gray-100 dark:bg-slate-600 border border-orange-500 rounded-lg">

                <View className="w-full flex flex-row items-center justify-end">
                    <Text onPress={() => setIsMenuVisible(false)} className="font-bold text-sm">
                        {language.includes("tr") ? "Kapat" : "Close"} X
                    </Text>
                </View>

                <View className="w-full py-3 flex flex-row items-center justify-center">
                    <Copy message={message} setIsMenuVisible={setIsMenuVisible} />
                    <Delete message={message} setIsMenuVisible={setIsMenuVisible} />
                </View>

            </View>

        </View>
    )
}

export default TargetUserMessageMenu