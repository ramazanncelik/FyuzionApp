import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import IconII from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-clipboard/clipboard';
import { useAuthContext } from '../../../../../navigation/AuthProvider';
import { getToastMessage } from '../../../../../utils/Toast';

const Copy = ({ message, setIsMenuVisible }) => {

    const { isDarkMode, language } = useAuthContext();

    const handleSubmit = async () => {
        if (message.Type === "text") {
            await Clipboard.setString(message.Description);
        } else {
            await Clipboard.setString(message.File.FileUrl);
        }
        setIsMenuVisible(false);
        getToastMessage({
            type: "info",
            text1: language.includes("tr") ?
                "Kopyalama başarılı" :
                "Copy successful",
            text2: language.includes("tr") ?
                "Mesaj başarılı bir şekilde kopyalandı" :
                "Message copied successfully",
        });
    }

    return (
        <TouchableOpacity onPress={() => handleSubmit()} className="flex-1 flex-col items-center justify-center">
            <IconII name="copy-outline" color={isDarkMode ? "white" : "black"} size={24} />
            <Text>
                {language.includes("tr") ? "Kopyala" : "Copy"}
            </Text>
        </TouchableOpacity>
    )
}

export default Copy