import { View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useAuthContext } from '../../navigation/AuthProvider';
import { useMutation } from '@apollo/client';
import IconII from 'react-native-vector-icons/Ionicons'
import { language } from '../../utils/utils';
import { createMessage } from '../../apollo/Message/messageMutations';
import { createOrUpdateChat } from '../../apollo/Chat/chatMutations';
import CustomLoading from '../../components/CustomLoading';
import * as ImagePicker from "react-native-image-picker"
import { useSelector } from 'react-redux';
import storage from '@react-native-firebase/storage'

const NewMessageForm = ({ targetUserId }) => {

    const { isDarkMode, userId } = useAuthContext();
    const { user } = useSelector(state => state.auth)
    const [newMessage, setNewMessage] = useState("");
    const [waitImagesUpload, setWaitImagesUpload] = useState(false);

    const [addOrUpdateChat, { loading: createOrUpdateChat_loading }] = useMutation(createOrUpdateChat);
    const [sendMessage, { loading: sendMessage_loading }] = useMutation(createMessage);

    const handleSubmit = async () => {

        const today = new Date();

        const time = today.getFullYear() + "" +
            (today.getMonth() < 10 ? ("0" + today.getMonth()) : today.getMonth())
            + "" +
            (today.getDate() < 10 ? ("0" + today.getDate()) : today.getDate())
            + "" +
            (today.getHours() < 10 ? ("0" + today.getHours()) : today.getHours())
            + "" +
            (today.getMinutes() < 10 ? ("0" + today.getMinutes()) : today.getMinutes())
            + "" +
            (today.getSeconds() < 10 ? ("0" + today.getSeconds()) : today.getSeconds())
            + "" +
            (today.getMilliseconds() < 10 ? ("0" + today.getMilliseconds()) : today.getMilliseconds());

        const from_to_FixedData = {
            From: userId,
            To: targetUserId,
        }

        const timeFixedData = {
            Date: today,
            Time: time,
        }

        setWaitImagesUpload(true);
        await sendMessage({
            variables: {
                data: {
                    ...from_to_FixedData,
                    Description: newMessage,
                    ...timeFixedData,
                    Type: "text",
                    IsEdited: false
                }
            }
        });
        await addOrUpdateChat({
            variables: {
                fromToData: from_to_FixedData,
                data: {
                    LastMessage: newMessage,
                    LastMessageOwner: userId,
                    Type: "text",
                    ...timeFixedData
                }
            }
        });

        await updateOrCreateChat(from_to_FixedData, {
            LastMessage: newMessage,
            LastMessageOwner: userId,
            Type: "text",
            ...timeFixedData
        });
        setWaitImagesUpload(false)
        setNewMessage("");

    }

    const handleSubmitImageMessage = async (s3FilePath, today, from_to_FixedData, timeFixedData, files) => {
        setWaitImagesUpload(true);
        for (let i = 0; i < files.length; i++) {
            const filePath = `MessageFiles/${user.Email}/${today}/file${i + 1}`;
            const reference = storage().ref(filePath);
            await reference.putFile(files[i].uri);
            const url = await storage().ref(filePath).getDownloadURL();
            const messageFile = {
                FilePath: filePath,
                FileName: `file${i + 1}`,
                FileType: files[i].type,
                FileUrl: url
            }
            await sendMessage({
                variables: {
                    data: {
                        ...from_to_FixedData,
                        File: messageFile,
                        ...timeFixedData,
                        Type: "file",
                        IsEdited: false
                    }
                }
            });
            await updateOrCreateChat(from_to_FixedData, {
                LastMessage: "File",
                LastMessageOwner: userId,
                Type: "file",
                ...timeFixedData
            });
            if (i + 1 === files.length) {
                await setWaitImagesUpload(false);
            }
        }
    }

    const updateOrCreateChat = async (fromToData, data) => {
        await addOrUpdateChat({
            variables: {
                fromToData: fromToData,
                data: data
            }
        });
    }

    const onSelectImagePress = () => {
        ImagePicker.launchImageLibrary({ mediaType: "photo", quality: 1.0, noData: true, selectionLimit: 9 }, onMediaSelect)
    };

    const onMediaSelect = async media => {
        if (!media.cancelled) {
            if (media.assets != undefined) {
                const today = new Date();

                const time = today.getFullYear() + "" +
                    (today.getMonth() < 10 ? ("0" + today.getMonth()) : today.getMonth())
                    + "" +
                    (today.getDate() < 10 ? ("0" + today.getDate()) : today.getDate())
                    + "" +
                    (today.getHours() < 10 ? ("0" + today.getHours()) : today.getHours())
                    + "" +
                    (today.getMinutes() < 10 ? ("0" + today.getMinutes()) : today.getMinutes())
                    + "" +
                    (today.getSeconds() < 10 ? ("0" + today.getSeconds()) : today.getSeconds())
                    + "" +
                    (today.getMilliseconds() < 10 ? ("0" + today.getMilliseconds()) : today.getMilliseconds());
                const from_to_FixedData = {
                    From: userId,
                    To: targetUserId,
                }

                const timeFixedData = {
                    Type: "text",
                    Date: today,
                    Time: time,
                }
                handleSubmitImageMessage(null, new Date(), from_to_FixedData, timeFixedData, media.assets)
            }
        }
    };

    return (
        <View className={`w-full flex flex-row h-max space-x-2 items-center p-2 border-t ${isDarkMode ? "border-slate-500" : "border-gray-200"}`}>

            <TouchableOpacity onPress={() => onSelectImagePress()} disabled={sendMessage_loading || createOrUpdateChat_loading || waitImagesUpload}>
                <IconII name="images-outline" color={isDarkMode ? "white" : "black"} size={24} />
            </TouchableOpacity>

            <TextInput
                inputMode="text"
                className="flex-1 bg-white mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={language.includes("tr") ? "Mesajınız" : "Your message"}
                onChangeText={value => setNewMessage(value)}
                keyboardType="email-address"
                value={newMessage}
            />

            {(sendMessage_loading || createOrUpdateChat_loading || waitImagesUpload) ?
                <CustomLoading type={"pacman"} indicatorSize={16} indicatorColor={"white"} className={"bg-blue-500 px-4 ml-2 rounded-lg items-center justify-center"} />
                :
                <TouchableOpacity onPress={() => handleSubmit()} disabled={!newMessage}>
                    <IconII name="send" color={"#3b82f6"} size={24} />
                </TouchableOpacity>}

        </View>
    )
}

export default NewMessageForm