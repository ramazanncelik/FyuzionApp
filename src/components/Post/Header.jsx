import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AuthContext } from '../../navigation/AuthProvider';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import PostHeaderMenuModal from '../../Modals/PostHeaderMenuModal';

const Header = ({ postFiles, postId, postOwner }) => {

    const { userId } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    if (userId === postOwner._id) {
        return (
            <View className="w-full h-auto flex flex-row space-x-2 px-2 mb-2">
                <View className="flex-1 flex-row space-x-2">
                    <FastImage
                        className="w-10 h-10 rounded-full"
                        source={{
                            uri: postOwner.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <View className="w-auto h-full jutify-center flex flex-col">
                        <Text className="text-black dark:text-white">
                            {postOwner.NickName}
                        </Text>
                        {postOwner.Name &&
                            <Text className="text-gray-400">
                                {postOwner.Name}
                            </Text>}
                    </View>
                </View>

                <TouchableOpacity onPress={() => toggleModal()}>
                    <IconMCI name='dots-vertical' size={24} />
                </TouchableOpacity>

                <Modal
                    isVisible={isModalVisible}
                    className="flex flex-col items-center justify-end m-0 p-0"
                    swipeDirection="down"
                    onBackdropPress={() => setIsModalVisible(false)}>
                    <PostHeaderMenuModal postOwner={postOwner._id} postId={postId} postFiles={postFiles} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
                </Modal>

            </View>
        );
    } else {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("TargetUser", { targetUserId: postOwner._id })} className="w-full h-auto flex flex-row space-x-2 items-center px-2 mb-2">
                <View className="flex-1 flex-row space-x-2">
                    <FastImage
                        className="w-10 h-10 rounded-full"
                        source={{
                            uri: postOwner.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <View className="w-auto h-full jutify-center flex flex-col">
                        <Text className="text-black dark:text-white">
                            {postOwner.NickName}
                        </Text>
                        {postOwner.Name &&
                            <Text className="text-gray-400">
                                {postOwner.Name}
                            </Text>}
                    </View>
                </View>

                <TouchableOpacity onPress={() => toggleModal()}>
                    <IconMCI name='dots-vertical' size={24} />
                </TouchableOpacity>

                <Modal
                    isVisible={isModalVisible}
                    className="flex flex-col items-center justify-end m-0 p-0"
                    swipeDirection="down"
                    onBackdropPress={() => setIsModalVisible(false)}>
                    <PostHeaderMenuModal postOwner={postOwner._id} postId={postId} postFiles={postFiles} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
                </Modal>

            </TouchableOpacity>
        );
    }
}
export default Header;