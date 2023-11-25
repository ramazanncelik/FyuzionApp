import { View, Text } from "react-native"
import React from "react"
import Toast from "react-native-toast-message"

export const toastConfig = {
    "success": (internalState) => (
        <View className="w-72 grid gap-1 p-1 bg-gray-50 dark:bg-gray-600 border-2 border-green-500 rounded-lg">
            <Text className="w-full text-black dark:text-white font-bold">{internalState.text1}</Text>
            {internalState.text2 &&
                <Text className="w-full text-black dark:text-white text-sm">{internalState.text2}</Text>}
        </View>
    ),
    "error": (internalState) => (
        <View className="w-72 grid gap-1 p-1 bg-gray-50 dark:bg-gray-600 border-2 border-red-500 rounded-lg">
            <Text className="w-full text-black dark:text-white font-bold">{internalState.text1}</Text>
            {internalState.text2 &&
                <Text className="w-full text-black dark:text-white text-sm">{internalState.text2}</Text>}
        </View>
    ),
    "info": (internalState) => (
        <View className="w-72 grid gap-1 p-1 bg-gray-50 dark:bg-gray-600 border-2 border-blue-500 rounded-lg">
            <Text className="w-full text-black dark:text-white font-bold">{internalState.text1}</Text>
            {internalState.text2 &&
                <Text className="w-full text-black dark:text-white text-sm">{internalState.text2}</Text>}
        </View>
    ),
    "any_custom_type": () => { }
}

export function getToastMessage(toast) {

    Toast.show({
        type: toast.type,
        position: "top",
        text1: toast.text1,
        text2: toast.text2,
        visibilityTime: 4000,
        autoHide: true,
        onShow: () => { },
        onHide: () => { }
    });

}