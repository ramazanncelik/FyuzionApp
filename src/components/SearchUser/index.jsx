import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'

const SearchUser = ({ searchUser }) => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("TargetUser", {
            targetUserId: searchUser._id
        })} className="flex-1 flex-row space-x-5 justify-center px-2 mb-2">
            <FastImage
                className="w-12 h-12 rounded-full"
                source={{
                    uri: searchUser.ImageUrl,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />

            <View className="h-full justify-center flex-1 flex-col">
                <Text className="text-black dark:text-white">
                    {searchUser.NickName}
                </Text>
                {searchUser.Name &&
                    <Text className="text-gray-400 text-sm">
                        {searchUser.Name}
                    </Text>}
            </View>
        </TouchableOpacity>
    )
}

export default SearchUser