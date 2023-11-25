import { SafeAreaView } from 'react-native'
import React from 'react'
import { PacmanIndicator, BallIndicator } from 'react-native-indicators'

const CustomLoading = ({ className, type, indicatorSize, indicatorColor }) => {
    if (type === "ball") {
        return (
            <SafeAreaView className={className}>
                <BallIndicator size={indicatorSize} color={indicatorColor} />
            </SafeAreaView>
        )
    } else if (type === "pacman") {
        return (
            <SafeAreaView className={className}>
                <PacmanIndicator size={indicatorSize} color={indicatorColor} />
            </SafeAreaView>
        )
    }
}

export default CustomLoading