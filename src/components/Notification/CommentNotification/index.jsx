import { Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import FastImage from 'react-native-fast-image';
import { language } from '../../../utils/utils';
import { useNavigation } from '@react-navigation/native';

const CommentNotification = ({ notificationData }) => {

    const navigation = useNavigation();
    const [date, setDate] = useState("");

    const editDate = () => {
        const postDate = new Date(notificationData.Date);
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
    }, [notificationData]);

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Post", {
            postId: notificationData.PostId
        })} className="w-full flex flex-row space-x-2 mb-4 items-center">
            <FastImage
                className="w-12 h-12 rounded-full"
                source={{
                    uri: notificationData.fromUser.ImageUrl,
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <Text className="flex-1 text-sm text-black dark:text-white">
                {language.includes("tr") ?
                    <>
                        <Text style={{ fontWeight: 'bold' }}>
                            {notificationData.fromUser.NickName.replace(/(.+)/g, '$1')}
                        </Text>
                        {`  kullanıcısı senin gönderine yorum yaptı  `}
                        <Text className="text-sm text-gray-400 dark:text-gray-300">
                            {date}
                        </Text>
                    </>
                    :
                    <>
                        {`User  `}
                        <Text style={{ fontWeight: 'bold' }}>
                            {notificationData.fromUser.NickName.replace(/(.+)/g, '$1')}
                        </Text>
                        {`  commented on your post  `}
                        <Text className="text-sm text-gray-400 dark:text-gray-300">
                            {date}
                        </Text>
                    </>}
            </Text>
        </TouchableOpacity>
    )
}

export default CommentNotification;