import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getTargetUser } from '../../apollo/TargetUser/targetUserQueries';
import { BallIndicator } from 'react-native-indicators'
import FastImage from 'react-native-fast-image';
import { useAuthContext } from '../../navigation/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const Header = ({ targetUserFollowerId, setIsModalVisible }) => {

    const { userId, isDarkMode } = useAuthContext();
    const navigation = useNavigation();
    const [targetUserFollowerData, setTargetUserFollowedData] = useState(null)

    const { data } = useQuery(getTargetUser, {
        variables: {
            _id: targetUserFollowerId
        },
    });

    useEffect(() => {
        if (data) {
            setTargetUserFollowedData(data.user);
        }
    }, [data]);


    if (targetUserFollowerData) {
        if (userId === targetUserFollowerId) {
            return (
                <View className="flex-1 flex-row space-x-2 items-center">
                    <FastImage
                        className="w-12 h-12 rounded-full"
                        source={{
                            uri: targetUserFollowerData.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View className="flex-1 flex-col justify-center">
                        <Text className="text-sm text-black dark:text-white">
                            {targetUserFollowerData.NickName}
                        </Text>
                        {targetUserFollowerData.Name &&
                            <Text className="text-sm text-gray-300 dark:text-gray-400">
                                {targetUserFollowerData.Name}
                            </Text>}
                    </View>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => {
                    navigation.navigate("TargetUser", {
                        targetUserId: targetUserFollowerId
                    });
                    setIsModalVisible(false);
                }} className="flex-1 flex-row space-x-2 items-center">
                    <FastImage
                        className="w-12 h-12 rounded-full"
                        source={{
                            uri: targetUserFollowerData.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View className="flex-1 flex-col justify-center">
                        <Text className="text-sm text-black dark:text-white">
                            {targetUserFollowerData.NickName}
                        </Text>
                        {targetUserFollowerData.Name &&
                            <Text className="text-sm text-gray-300 dark:text-gray-400">
                                {targetUserFollowerData.Name}
                            </Text>}
                    </View>
                </TouchableOpacity>
            )
        }
    } else {
        return (
            <View className="w-full p-3 border border-gray-300 rounded-lg items-center justify-center">
                <BallIndicator size={20} color={isDarkMode ? "white" : "black"} />
            </View>
        )
    }
}

export default Header