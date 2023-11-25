import React from 'react';
import { View, Text } from 'react-native';

const Description = ({ Description }) => {

    return (
        <View className="w-full h-auto px-2 mb-2">
            <Text className="w-full text-black dark:text-white">
                {Description}
            </Text>
        </View>
    );

}
export default Description;