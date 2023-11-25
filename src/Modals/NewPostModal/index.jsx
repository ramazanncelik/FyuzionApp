import { View, Text, TouchableOpacity, TextInput } from "react-native"
import React, { useState, useEffect } from "react"
import { language } from "../../utils/utils";
import { useAuthContext } from "../../navigation/AuthProvider";
import *as ImagePicker from "react-native-image-picker"
import { useMutation } from "@apollo/client";
import { sharePost } from "../../apollo/Post/postMutations";
import { getToastMessage } from "../../utils/Toast";
import { newPostValidations } from "../../utils/validations";
import { useFormik } from "formik";
import CustomLoading from "../../components/CustomLoading";
import storage from '@react-native-firebase/storage';

const NewPostModal = ({ isModalVisible, setIsModalVisible }) => {

    const { userId, user } = useAuthContext();
    const [currentUser, setCurrentUser] = useState(user);
    const [files, setFiles] = useState([]);
    const [waitFilesUpload, setWaitFilesUpload] = useState(false);

    const [addPost, { loading }] = useMutation(sharePost);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onSelectFilePress = () => {
        ImagePicker.launchImageLibrary({
            mediaType: "mixed",
            quality: 1,
            selectionLimit: 10,
            videoQuality: "medium",
            includeBase64: true,
            maxWidth: 1080,
            maxHeight: 500
        }, onMediaSelect);
    };

    const onMediaSelect = async media => {
        if (!media.cancelled) {
            if (media.assets != undefined) {
                setFiles(media.assets);
            }
        }
    };

    const { handleChange, handleSubmit, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            Description: ""
        },
        onSubmit: async (values) => {
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

            if (files.length === 0) {
                const post = {
                    OwnerId: userId,
                    Description: values.Description,
                    Files: [],
                    Like: 0,
                    Comment: 0,
                    CommentsIsClosed: false,
                    Date: today,
                    Time: time,
                };
                addPost({
                    variables: {
                        data: post
                    }
                }).then((result) => {
                    if (result.data.createPost) {
                        toggleModal();
                        setFiles([]);
                        handleReset();
                        getToastMessage({
                            type: "success",
                            text1: language.includes("tr") ?
                                "Gönderi Paylaşımı Başarılı" :
                                "Post Sharing Successful",
                            text2: language.includes("tr") ?
                                "Gönderiniz başarılı bir şekilde paylaşıldı" :
                                "Your post has been successfully shared",
                        });
                    }
                });
            } else {
                setWaitFilesUpload(true);
                handleSubmitPart2(null, today, time);
            }
        },
        validationSchema: newPostValidations
    });

    const handleSubmitPart2 = async (s3FilePath, today, time) => {
        const fileList = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = `PostFiles/${user.Email}/${today}/file${i + 1}`;
            const reference = storage().ref(filePath);
            await reference.putFile(files[i].uri);
            const url = await storage().ref(filePath).getDownloadURL();
            await fileList.push({
                FilePath: filePath,
                FileName: `file${i + 1}`,
                FileType: files[i].type,
                FileUrl: url
            });
            if (fileList.length === files.length) {
                const post = {
                    OwnerId: userId,
                    Description: values.Description,
                    Files: fileList,
                    Like: 0,
                    Comment: 0,
                    CommentsIsClosed: false,
                    Date: today,
                    Time: time,
                };
                addPost({
                    variables: {
                        data: post
                    }
                }).then((result) => {
                    if (result.data.createPost) {
                        toggleModal();
                        setFiles([]);
                        handleReset();
                        getToastMessage({
                            type: "success",
                            text1: language.includes("tr") ?
                                "Gönderi Paylaşımı Başarılı" :
                                "Post Sharing Successful",
                            text2: language.includes("tr") ?
                                "Gönderiniz başarılı bir şekilde paylaşıldı" :
                                "Your post has been successfully shared",
                        });
                    }
                });
                await setWaitFilesUpload(false);
            }
        }
    }

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    if (currentUser) {
        return (
            <View className="h-auto flex flex-col space-y-3 p-2 bg-white dark:bg-gray-700 rounded-lg">

                <View className="w-full flex flex-row space-x-20 items-center">
                    <Text className="text-black dark:text-white font-bold">
                        {language.includes("tr") ? "Gönderi Paylaş" : "Share Post"}
                    </Text>
                </View>

                <TextInput
                    focusable={true}
                    editable={!waitFilesUpload || loading}
                    selectTextOnFocus={!waitFilesUpload || loading}
                    className={`w-full h-36 bg-white border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500`}
                    name="Description"
                    placeholder={language.includes("tr") ? "Gönderi Açıklaması - Zorunlu!" : "Post Description - Required!"}
                    multiline={true}
                    textAlignVertical={"top"}
                    numberOfLines={7}
                    onChangeText={handleChange("Description")}
                    value={values.Description}
                />
                {errors.Description && touched.Description &&
                    <Text className="w-full bg-red-500 p-2 rounded text-white mb-3">
                        {errors.Description}
                    </Text>}

                {loading || waitFilesUpload ?
                    <CustomLoading type={"pacman"} indicatorSize={36} indicatorColor={"white"} className={"w-full flex flex-row mt-2 bg-blue-400 items-center rounded-lg"} />
                    :
                    <View className="w-full flex flex-col space-y-2">
                        <View className="w-full flex flex-row space-x-2 items-center">
                            <TouchableOpacity onPress={() => onSelectFilePress()} className="w-80 bg-gray-400 p-2 rounded-lg items-center">
                                <Text className="text-white font-bold">
                                    {language.includes("tr") ? "Resim veya Video Seçin (Zorunlu Değil)" : "Select Image or Video (Not required)"}
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-black dark:text-white">
                                {files ?
                                    files.length : <></>}
                            </Text>
                        </View>

                        <View className="w-full flex flex-row space-x-2 items-center">
                            <TouchableOpacity className="w-[48%] p-2 bg-blue-500 items-center rounded-lg" onPress={() => toggleModal()}>
                                <Text className="text-white font-bold">
                                    {language.includes("tr") ? "Kapat" : "Close"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className={`w-[48%] p-2 bg-orange-500 items-center rounded-lg`} onPress={() => handleSubmit()}>
                                <Text className="text-white font-bold">
                                    {language.includes("tr") ? "Paylaş" : "Share"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </View>
        )
    }
}

export default NewPostModal;