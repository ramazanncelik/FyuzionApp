import { View, Text, TouchableOpacity } from 'react-native'
import IconAD from 'react-native-vector-icons/AntDesign'
import { useMutation } from '@apollo/client';
import { createEmailVerifyMail } from '../../../apollo/User/userMutations';
import { useAuthContext } from '../../../navigation/AuthProvider';
import { BallIndicator } from 'react-native-indicators'
import { getToastMessage } from '../../../utils/Toast';

const GetEmailVerifyMail = () => {

    const { isDarkMode, language, user } = useAuthContext();

    const [createMail, { loading }] = useMutation(createEmailVerifyMail);

    const handleSubmit = async () => {
        const result = await createMail({
            variables: {
                data: {
                    to: user.Email,
                    subject: language.includes("tr") ? "E-posta Onaylama - Fyuzion" : "Email Verify - Fyuzion",
                    text: language.includes("tr") ? "E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayabilirsiniz" : "You can click on the link below to verify your email address",
                }
            }
        });
        if (result) {
            if (result.data) {
                if (result.data.createEmailVerifyMail) {
                    getToastMessage({
                        type: "success",
                        text1: language.includes("tr") ?
                            "Mail Gönderimi Başarılı" :
                            "Email Send Successful",
                        text2: language.includes("tr") ?
                            "Mail başarıyla gönderildi. Lütfen mail adresinizi kontrol ediniz." :
                            "Email sent successfully. Please check your e-mail address."
                    });
                } else {
                    getToastMessage({
                        type: "error",
                        text1: language.includes("tr") ?
                            "Mail Gönderimi Başarısız" :
                            "Mail Send Failed",
                        text2: language.includes("tr") ?
                            "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
                            "Email sending failed. Please try again.",
                    });
                }
            } else {
                getToastMessage({
                    type: "error",
                    text1: language.includes("tr") ?
                        "Mail Gönderimi Başarısız" :
                        "Mail Send Failed",
                    text2: language.includes("tr") ?
                        "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
                        "Email sending failed. Please try again.",
                });
            }
        }
    }

    if (!loading) {
        return (
            <TouchableOpacity disabled={loading}
                className="w-full px-2 py-3 border-b border-gray-300 dark:border-gray-400 flex flex-row space-x-3 items-center"
                onPress={() => handleSubmit()}>
                <IconAD name="mail" size={28} color={isDarkMode ? "white" : "black"} />

                <Text className="text-black dark:text-white">
                    {language.includes("tr") ? "Mail Adresimi Onayla" : "Confirm My Mail Address"}
                </Text>
            </TouchableOpacity>
        )
    } else {
        return (
            <View
                className="w-full p-7 border-b border-gray-300 dark:border-gray-400 items-center justify-center">
                <BallIndicator size={16} color={isDarkMode ? "white" : "black"} />
            </View>
        )
    }
}

export default GetEmailVerifyMail;