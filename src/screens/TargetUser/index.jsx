import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import IconAntD from 'react-native-vector-icons/AntDesign'
import { useQuery } from '@apollo/client';
import { getTargetUser } from '../../apollo/TargetUser/targetUserQueries';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';
import { language } from '../../utils/utils';
import FastImage from 'react-native-fast-image';
import { getTargetUserPosts } from '../../apollo/TargetUserPost/targetUserPostQueries';
import PostInfo from '../../components/PostInfo';
import IconF from 'react-native-vector-icons/Feather'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import Connection from './Actions/Connection';
import TargetUserFollowedsModal from '../../Modals/TargetUserFollowedsModal';
import Modal from 'react-native-modal'
import { useAuthContext } from '../../navigation/AuthProvider';
import TargetUserFollowersModal from '../../Modals/TargetUserFollowersModal';
import Message from './Actions/Message';

const TargetUser = ({ route }) => {

    const { targetUserId } = route.params;
    const { isDarkMode } = useAuthContext();
    const navigation = useNavigation();
    const { loading: getTargetUser_loading, data: getTargetUser_data, refetch: getTargetUser_refetch } = useQuery(getTargetUser, {
        variables: {
            _id: targetUserId
        },
        fetchPolicy: 'no-cache',
    });
    const { loading: getTargetUserPosts_loading, data: getTargetUserPosts_data, refetch: getTargetUserPosts_refetch } = useQuery(getTargetUserPosts, {
        variables: {
            user_id: targetUserId
        },
        fetchPolicy: 'no-cache',
    });
    const [targetUser, setTargetUser] = useState({});
    const [targetUserPosts, setTargetUserPosts] = useState([]);
    const [connectionId, setConnectionId] = useState(null);
    const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
    const [isMyFollowedModalVisible, setIsMyFollowedModalVisible] = useState(false);

    const renderItem = ({ item }) => (
        <React.Fragment>
            <PostInfo postId={item._id} />
        </React.Fragment>
    );

    const toggleFollowersModal = () => {
        setIsFollowersModalVisible(!isFollowersModalVisible);
    };

    const toggleMyFollowedModal = () => {
        setIsMyFollowedModalVisible(!isMyFollowedModalVisible);
    };

    const goToLink = () => {
        const url = targetUser.Website;
        if (!/^https?:\/\//i.test(url)) {
            const newUrl = `https://${url}`;
            Linking.openURL(newUrl);
        } else {
            Linking.openURL(url);
        }
    };

    useEffect(() => {

        getTargetUser_refetch({
            _id: targetUserId
        });
        getTargetUserPosts_refetch({
            user_id: targetUserId
        });
    }, [targetUserId]);

    useEffect(() => {

        if (getTargetUser_data) {
            setTargetUser(getTargetUser_data.user);
        }

    }, [getTargetUser_data]);

    useEffect(() => {

        if (getTargetUserPosts_data) {
            const list = [];
            Object.assign(list, getTargetUserPosts_data.posts);
            list.sort((a, b) => { return (b.Time) - (a.Time) });
            setTargetUserPosts(list);
        }

    }, [getTargetUserPosts_data]);

    if (!getTargetUser_loading && !getTargetUserPosts_loading) {
        return (
            <SafeAreaView className="h-full flex flex-col space-y-2 bg-white dark:bg-gray-700 px-2 pt-2">

                <TouchableOpacity onPress={() => navigation.goBack()}
                    className="w-full flex flex-row space-x-5 items-center">
                    <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                    <Text className="text-black dark:text-white text-lg">
                        {targetUser.NickName}
                    </Text>
                </TouchableOpacity>

                <View className="w-full flex-row space-x-14 items-center justify-center">

                    <FastImage
                        className="w-24 h-24 rounded-full"
                        source={{
                            uri: targetUser.ImageUrl,
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
                                {targetUserPosts.length}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => toggleFollowersModal()} className="flex-col mr-8 gap-1 items-center">
                            <Text className="text-black dark:text-white">
                                {language.includes("tr") ? "Takipçi" : "Follower"}
                            </Text>

                            <Text className="text-black dark:text-white">
                                {targetUser.Follower}
                            </Text>
                            <Modal className="px-5" isVisible={isFollowersModalVisible}>
                                <TargetUserFollowersModal targetUserId={targetUserId} isModalVisible={isFollowersModalVisible} setIsModalVisible={setIsFollowersModalVisible} />
                            </Modal>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleMyFollowedModal()} className="flex-col space-y-1 items-center">
                            <Text className="text-black dark:text-white">
                                {language.includes("tr") ? "Takip" : "Follow"}
                            </Text>

                            <Text className="text-black dark:text-white">
                                {targetUser.MyFollowed}
                            </Text>

                            <Modal className="px-5" isVisible={isMyFollowedModalVisible}>
                                <TargetUserFollowedsModal targetUserId={targetUserId} isModalVisible={isMyFollowedModalVisible} setIsModalVisible={setIsMyFollowedModalVisible} />
                            </Modal>
                        </TouchableOpacity>

                    </View>

                </View>

                <View className="w-full flex flex-col space-y-1">
                    {targetUser.Name &&
                        <Text className="text-black dark:text-white">
                            {targetUser.Name}
                        </Text>}

                    {targetUser.Biography &&
                        <Text className="text-black dark:text-white">
                            {targetUser.Biography}
                        </Text>}

                    {targetUser.Website &&
                        <Text onPress={() => goToLink()} className="text-blue-500 underline">
                            {targetUser.Website}
                        </Text>}
                </View>

                <View className="w-full flex flex-row">
                    <Connection connectionId={connectionId} setConnectionId={setConnectionId} targetUserId={targetUserId} />
                    {targetUser.IsPrivate === true ?
                        (connectionId &&
                            <Message targetUserId={targetUserId} />
                        )
                        :
                        <Message targetUserId={targetUserId} />}
                </View>

                {targetUser.IsPrivate === true &&
                    (connectionId &&
                        (targetUserPosts.length !== 0 &&
                            <FlatList className="w-full"
                                numColumns={3}
                                data={targetUserPosts}
                                renderItem={renderItem}
                                keyExtractor={(item) => item._id}
                            /> ||
                            <View className="flex-1 flex-col space-y-3 items-center justify-center">
                                <IconF name="camera-off" size={100} color="#9ca3af" />
                                <Text className="text-lg text-gray-400 text-center">
                                    {language.includes("tr") ? "Kullanıcının Henüz Herhangi Bir Paylaşımı Bulunmamaktadır" : "The User Does Not Have Any Shares Yet"}
                                </Text>
                            </View>)
                        ||
                        <View className="flex-1 flex-col space-y-3 items-center justify-center">
                            <IconFA5 name="user-secret" size={100} color="#9ca3af" />
                            <Text className="text-lg text-gray-400 text-center">
                                {language.includes("tr") ? "Bu Hesap Gizli" : "This Account is Private"}
                            </Text>
                        </View>
                    )
                    ||
                    (
                        targetUserPosts.length !== 0 &&
                        <FlatList className="w-full"
                            numColumns={3}
                            data={targetUserPosts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                        /> ||
                        <View className="flex-1 flex-col space-y-3 items-center justify-center">
                            <IconF name="camera-off" size={100} color="#9ca3af" />
                            <Text className="text-lg text-gray-400 text-center">
                                {language.includes("tr") ? "Kullanıcının Henüz Herhangi Bir Paylaşımı Bulunmamaktadır" : "The User Does Not Have Any Shares Yet"}
                            </Text>
                        </View>
                    )}

            </SafeAreaView>
        )
    } else {
        return <Loading />
    }
}

export default TargetUser