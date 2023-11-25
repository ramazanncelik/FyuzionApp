import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../navigation/AuthProvider';

const PostDate = ({ postData }) => {

    const { language } = useAuthContext();
    const [date, setDate] = useState("");

    const editDate = () => {
        const postDate = new Date(postData.Date);
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
    }, [postData]);

    return (
        <View className="w-full h-auto px-2 mb-2">
            <Text className="text-sm text-right">
                {date}
            </Text>
        </View>
    )
}

export default PostDate;