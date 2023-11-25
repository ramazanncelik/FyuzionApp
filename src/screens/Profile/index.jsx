import { View, Text, TouchableOpacity, SafeAreaView, Linking, FlatList } from "react-native"
import React, { useEffect, useState } from "react"
import { useAuthContext } from "../../navigation/AuthProvider"
import IconAntD from "react-native-vector-icons/AntDesign"
import IconII from "react-native-vector-icons/Ionicons"
import FastImage from "react-native-fast-image"
import { language } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal"
import NewPostModal from "../../Modals/NewPostModal";
import PostInfo from "../../components/PostInfo";
import IconF from 'react-native-vector-icons/Feather'
import FollowersModal from "../../Modals/FollowersModal";
import MyFollowedsModal from "../../Modals/MyFollowedsModal";

const Profile = () => {

    const { isDarkMode, user, myPosts } = useAuthContext();
    const [currentUser, setCurrentUser] = useState(user)
    const [currentUserPosts, setCurrentUserPosts] = useState(myPosts)
    const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);
    const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
    const [isMyFollowedModalVisible, setIsMyFollowedModalVisible] = useState(false);

    const navigation = useNavigation();

    const toggleNewPostModal = () => {
        setIsNewPostModalVisible(!isNewPostModalVisible);
    };

    const toggleFollowersModal = () => {
        setIsFollowersModalVisible(!isFollowersModalVisible);
    };

    const toggleMyFollowedModal = () => {
        setIsMyFollowedModalVisible(!isMyFollowedModalVisible);
    };

    const renderItem = ({ item }) => (
        <React.Fragment>
            <PostInfo postId={item._id} />
        </React.Fragment>
    );

    const goToLink = () => {
        const url = currentUser.Website;
        if (!/^https?:\/\//i.test(url)) {
            const newUrl = `https://${url}`;
            Linking.openURL(newUrl);
        } else {
            Linking.openURL(url);
        }
    };

    useEffect(() => {
        setCurrentUser(user)
    }, [user]);

    useEffect(() => {
        const list = [];
        Object.assign(list, myPosts);
        list.sort((a, b) => { return (b.Time) - (a.Time) });
        setCurrentUserPosts(list);
    }, [myPosts]);

    return (
        <SafeAreaView className="h-full bg-white dark:bg-gray-700 px-2 pt-2">
            <View className="h-full flex-col space-y-2">

                <View className="w-full h-auto flex flex-row space-x-4 p-2 items-center">
                    <Text className="w-[80%] text-lg text-black dark:text-white">
                        {currentUser.NickName}
                    </Text>

                    <View className="w-auto flex flex-row space-x-6 items-center">
                        <TouchableOpacity onPress={() => toggleNewPostModal()}>
                            <IconAntD name="plussquareo" size={20} color={isDarkMode ? "white" : "black"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                            <IconII name="menu" size={28} color={isDarkMode ? "white" : "black"} />
                        </TouchableOpacity>
                    </View>

                    <Modal isVisible={isNewPostModalVisible}>
                        <NewPostModal isModalVisible={isNewPostModalVisible} setIsModalVisible={setIsNewPostModalVisible} />
                    </Modal>
                </View>

                <View className="w-full flex-row space-x-1 items-center justify-center">

                    <FastImage
                        className="w-24 h-24 rounded-full mr-16"
                        source={{
                            uri: currentUser.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <View className="flex-row">

                        <View className="flex-col mr-8 gap-1 items-center">
                            <Text className="text-black dark:text-white">
                                {language.includes("tr") ? "Gönderi" : "Post"}
                            </Text>

                            <Text className="text-black dark:text-white">
                                {currentUserPosts.length}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => toggleFollowersModal()} className="flex-col mr-8 gap-1 items-center">
                            <Text className="text-black dark:text-white">
                                {language.includes("tr") ? "Takipçi" : "Follower"}
                            </Text>

                            <Text className="text-black dark:text-white">
                                {currentUser.Follower}
                            </Text>

                            <Modal className="px-5" isVisible={isFollowersModalVisible}>
                                <FollowersModal isModalVisible={isFollowersModalVisible} setIsModalVisible={setIsFollowersModalVisible} />
                            </Modal>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleMyFollowedModal()} className="flex-col space-y-1 items-center">
                            <Text className="text-black dark:text-white">
                                {language.includes("tr") ? "Takip" : "Follow"}
                            </Text>

                            <Text className="text-black dark:text-white">
                                {currentUser.MyFollowed}
                            </Text>

                            <Modal className="px-5" isVisible={isMyFollowedModalVisible}>
                                <MyFollowedsModal isModalVisible={isMyFollowedModalVisible} setIsModalVisible={setIsMyFollowedModalVisible} />
                            </Modal>
                        </TouchableOpacity>

                    </View>

                </View>

                <View className="w-full flex-col space-y-1">
                    {currentUser.Name &&
                        <Text className="text-black dark:text-white">
                            {currentUser.Name}
                        </Text>}

                    {currentUser.Biography &&
                        <Text className="text-black dark:text-white">
                            {currentUser.Biography}
                        </Text>}

                    {currentUser.Website &&
                        <Text onPress={() => goToLink()} className="text-blue-500 underline">
                            {currentUser.Website}
                        </Text>}
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")} className="w-100 p-2 items-center justify-center bg-orange-500 rounded-lg">
                    <Text className=" font-bold text-white">
                        {language.includes("tr") ? "Profili Düzenle" : "Edit Profile"}
                    </Text>
                </TouchableOpacity>

                {currentUserPosts.length !== 0 &&
                    <FlatList className="w-full"
                        numColumns={3}
                        data={currentUserPosts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    /> ||
                    <View className="flex-1 flex-col space-y-3 items-center justify-center">
                        <IconF name="camera-off" size={100} color="#9ca3af" />
                        <Text className="text-lg text-gray-400">
                            {language.includes("tr") ? "Henüz Paylaştığınız Bir Gönderi Yok" : "No Posts You Have Shared Yet"}
                        </Text>
                    </View>}
            </View>
        </SafeAreaView>
    )
}

export default Profile;