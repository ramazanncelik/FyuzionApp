import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import IconE from 'react-native-vector-icons/Entypo'
import { useAuthContext } from '../../../../../navigation/AuthProvider';
import store from '../../../../../store';
import { setMessage } from '../../../../../store/messageInfoForEdit';

const Edit = ({ message, setIsMenuVisible }) => {

    const { isDarkMode, language } = useAuthContext();

    return (
        <TouchableOpacity onPress={() => { store.dispatch(setMessage(message)); setIsMenuVisible(false) }} className="flex flex-1 flex-col items-center justify-center">
            <IconE name="edit" color={isDarkMode ? "white" : "black"} size={24} />
            <Text>
                {language.includes("tr") ? "Düzenle" : "Edit"}
            </Text>
        </TouchableOpacity>
    )
}

export default Edit