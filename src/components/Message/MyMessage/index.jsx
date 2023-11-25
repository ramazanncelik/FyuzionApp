import { TouchableOpacity, View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { language } from '../../../utils/utils'
import MyMessageMenu from './Menu';
import FastImage from 'react-native-fast-image';
import { useAuthContext } from '../../../navigation/AuthProvider';

const MyMessage = ({ message }) => {

    const { isDarkMode } = useAuthContext();
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const [date, setDate] = useState("");

    const editDate = () => {
        const postDate = new Date(message.Date);
        const currentDate = new Date();

        const timeDiff = Math.abs(currentDate - postDate);

        const yearsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
        const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const secondsDiff = Math.floor(timeDiff / 1000);

        if (yearsDiff > 0) {
            setDate(`${yearsDiff} ${language.includes("tr") ? "yıl önce" : "years ago"}`);
        } else if (monthsDiff > 0) {
            setDate(`${monthsDiff} ${language.includes("tr") ? "ay önce" : "months ago"}`);
        } else if (daysDiff > 0) {
            setDate(`${daysDiff} ${language.includes("tr") ? "gün önce" : "days ago"}`);
        } else if (hoursDiff > 0) {
            setDate(`${hoursDiff} ${language.includes("tr") ? "saat önce" : "hours ago"}`);
        } else if (minutesDiff > 0) {
            setDate(`${minutesDiff} ${language.includes("tr") ? "dakika önce" : "minutes ago"}`);
        } else {
            setDate(`${secondsDiff} ${language.includes("tr") ? "saniye önce" : "seconds ago"}`);
        }
    };

    useEffect(() => {
        editDate();
    }, [message]);

    if (!isMenuVisible) {
        if (message.Type === "text") {
            return (
                <View className="w-full flex flex-row items-center justify-end my-1">

                    <TouchableOpacity onLongPress={() => setIsMenuVisible(true)} className="w-[75%] flex flex-col px-2 py-1 bg-green-500 rounded-lg">
                        <Text className="text-white font-bold">
                            {language.includes("tr") ? "Siz" : "You"}
                        </Text>

                        <Text className="text-white">
                            {message.Description}
                        </Text>

                        <View className="w-full flex flex-row items-center justify-end space-x-2">
                            <Text className="text-sm text-gray-300">
                                {message.IsEdited === true &&
                                    (language.includes("tr") ? "Düzenlendi" : "Edited")}
                            </Text>
                            <Text className="flex flex-1 text-sm text-right text-gray-300">
                                {date}
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )
        } else {
            return (
                <View className="w-full flex flex-row items-center justify-end my-1">

                    <TouchableOpacity onLongPress={() => setIsMenuVisible(true)} className={`w-[75%] flex flex-col px-2 py-1 rounded-lg border border-green-500`}>
                        <Text className={`font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                            {language.includes("tr") ? "Siz" : "You"}
                        </Text>


                        <FastImage
                            className="w-full h-72 rounded-lg"
                            source={{
                                uri: message.File.FileUrl,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                        <Text className={`text-sm text-right ${isDarkMode ? "text-slate-300" : "text-gray-400"}`}>
                            {date}
                        </Text>
                    </TouchableOpacity>

                </View>
            )
        }
    } else {
        return (
            <MyMessageMenu message={message} setIsMenuVisible={setIsMenuVisible} />
        )
    }
}

export default MyMessage