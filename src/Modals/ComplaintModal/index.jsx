import { SafeAreaView, TouchableOpacity, ScrollView, View, Text, TextInput } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../navigation/AuthProvider';
import { newComplaintValidations } from '../../utils/validations';
import { useFormik } from 'formik';
import SelectDropdown from 'react-native-select-dropdown'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import { reportTitleList } from '../../utils/reportTitleList';
import { useMutation } from '@apollo/client';
import { addComplaint } from '../../apollo/Complaint/complaintMutations';
import CustomLoading from '../../components/CustomLoading';
import { getToastMessage } from '../../utils/Toast';

const ComplaintModal = ({ route }) => {

    const { postId } = route.params;
    const { language, userId } = useAuthContext();
    const navigation = useNavigation();

    const [createComplaint, { loading }] = useMutation(addComplaint);

    const { handleChange,handleReset, handleSubmit, values, errors, touched } = useFormik({
        initialValues: {
            Title: "",
            Description: "",
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

            const result = await createComplaint({
                variables: {
                    data: {
                        UserId: userId,
                        PostId: postId,
                        ...values,
                        Date: today,
                        Time: time
                    }
                }
            });
            if (result) {
                if (result.data) {
                    if (result.data.createComplaint) {
                        await getToastMessage({
                            type: "success",
                            text1: language.includes("tr") ?
                                "Gönderi Bildirildi" :
                                "Post Notified",
                            text2: language.includes("tr") ?
                                "Gönderi başarıyla bildirildi" :
                                "Post successfully reported",
                        });
                        await handleReset();
                        await navigation.goBack();
                    } else {
                        await getToastMessage({
                            type: "error",
                            text1: language.includes("tr") ?
                                "Gönderi Bildirilemedi" :
                                "Unable to Report Post",
                            text2: language.includes("tr") ?
                                "Gönderi rapor edilirken bir hata oluştu" :
                                "An error occurred while reporting the post",
                        });
                    }
                }
            }
        },
        validationSchema: newComplaintValidations
    });

    return (
        <SafeAreaView className="w-full h-full flex items-center justify-center p-2 opacity-90 bg-black">
            <View className="w-[85%] h-80 bg-white rounded-lg">
                <ScrollView className="w-full h-full flex flex-col bg-white p-2 rounded-lg">

                    <Text className="text-black font-bold text-lg mb-3">
                        {language.includes("tr") ? "Gönderiyi Bildir" : "Report Post"}
                    </Text>

                    <View className="w-full flex flex-col space-y-1 mb-2">
                        <SelectDropdown
                            name="Title"
                            buttonStyle={{
                                width: '100%',
                                borderWidth: 1,
                                borderRadius: 10,
                                borderColor: "black",
                                backgroundColor: "white",
                            }} buttonTextStyle={{
                                color: "black"
                            }} renderDropdownIcon={() => {
                                return (
                                    <IconMCI style={{
                                        color: "black"
                                    }}
                                        name='chevron-down'
                                        size={24} />
                                )
                            }} dropdownIconPosition='right' dropdownStyle={{
                                borderRadius: 10
                            }}
                            data={reportTitleList}
                            defaultButtonText={language.includes("tr") ? "Lütfen Bir Başlık Seçiniz" : "Please Select a Title"}
                            onSelect={handleChange("Title")}
                        />
                        {errors.Title && touched.Title &&
                            <Text className="w-full bg-red-500 p-2 rounded text-white mb-3">
                                {errors.Title}
                            </Text>}
                    </View>

                    <View className="w-full flex flex-col space-y-1 mb-2">
                        <TextInput
                            placeholderTextColor={"gray"}
                            focusable={true}
                            editable={!loading}
                            selectTextOnFocus={loading}
                            className={`w-full h-36 bg-white border border-black text-black text-sm rounded-lg block p-2.5`}
                            name="Description"
                            placeholder={language.includes("tr") ? "Açıklama" : "Description"}
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
                    </View>

                    <View className="w-full flex space-y-1 mb-3">
                        {!loading ?
                            <View className="w-full flex flex-row space-x-2">
                                <TouchableOpacity onPress={() => navigation.goBack()} className="flex flex-1 h-max items-center justify-center bg-gray-200 p-3 rounded-lg">
                                    <Text className="text-black font-semibold">
                                        {language.includes("tr") ? "Kapat" : "Close"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSubmit} className="flex flex-1 h-max items-center justify-center bg-blue-500 p-3 rounded-lg">
                                    <Text className="text-white font-semibold">
                                        {language.includes("tr") ? "Şikayet Et" : "Complain"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <CustomLoading
                                className={"w-full py-3 bg-blue-500 rounded-lg"}
                                type={"pacman"}
                                indicatorColor={"white"}
                                indicatorSize={24}
                            />}
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default ComplaintModal