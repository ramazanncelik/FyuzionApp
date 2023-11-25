import { Text, TouchableOpacity } from "react-native"
import { useAuthContext } from "../../navigation/AuthProvider"
import IconF from 'react-native-vector-icons/Feather'
import { useNavigation } from "@react-navigation/native"

const CreateComplaint = ({ postId, setIsModalVisible }) => {

    const { isDarkMode, language } = useAuthContext();
    const navigation = useNavigation();

    const handleSubmit = async () => {
        await setIsModalVisible(false);
        await navigation.navigate("ComplaintModal", {
            postId: postId
        });
    }

    return (
        <TouchableOpacity
            onPress={() => handleSubmit()}
            className="w-full border-b border-gray-300 dark:border-gray-400 p-3 flex flex-row space-x-5 items-center">
            <IconF name='flag' size={24} color={isDarkMode ? "white" : "black"} />

            <Text className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                {language.includes("tr") ? "Şikayet Et" : "Complain"}
            </Text>
        </TouchableOpacity>
    )
}

export default CreateComplaint