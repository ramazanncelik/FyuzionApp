import { SafeAreaView, Text, TouchableOpacity } from "react-native"
import { useAuthContext } from "../../navigation/AuthProvider"
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../../store";
import { logout } from "../../store/auth";
import IconOI from 'react-native-vector-icons/Octicons'
import IconAntD from 'react-native-vector-icons/AntDesign'
import { language } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import ChangeIsPrivate from "../../components/MenuComponents/ChangeIsPrivate";
import GetEmailVerifyMail from "../../components/MenuComponents/GetEmailVerifyMail";

const Menu = () => {

    const { isDarkMode, setUserId, user } = useAuthContext();
    const navigation = useNavigation();

    const signOut = async () => {
        AsyncStorage.removeItem("userId");
        setUserId(null)
        store.dispatch(logout());
    }

    return (
        <SafeAreaView className="h-full bg-white dark:bg-gray-700 pt-2">

            <TouchableOpacity onPress={() => navigation.goBack()}
                className="flex-row gap-3 items-center p-2">
                <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                <Text className="text-lg text-black dark:text-white">
                    {language.includes("tr") ? "Menü" : "Menu"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full p-3 border-b border-gray-300 dark:border-gray-400 flex flex-row space-x-5 items-center"
                onPress={() => navigation.navigate("SavedPosts")}>
                <IconOI name="bookmark" size={24} color={isDarkMode ? "white" : "black"} />

                <Text className="text-black dark:text-white">
                    {language.includes("tr") ? "Kaydedilen Gönderiler" : "Saved Posts"}
                </Text>
            </TouchableOpacity>

            <ChangeIsPrivate />
            {!user.EmailVerify &&
                <GetEmailVerifyMail />}

            <TouchableOpacity
                className="w-full p-3 border-b border-gray-300 dark:border-gray-400 flex flex-row space-x-5 items-center"
                onPress={() => signOut()}>
                <IconOI name="sign-out" size={24} color={isDarkMode ? "white" : "black"} />

                <Text className="text-black dark:text-white">
                    {language.includes("tr") ? "Çıkış Yap" : "Sign Out"}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Menu