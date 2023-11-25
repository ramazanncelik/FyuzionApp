import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconOI from 'react-native-vector-icons/Octicons'
import { getPostActions } from '../../../apollo/Post/postQueries';
import Modal from "react-native-modal"
import CommentModal from '../../../Modals/CommentModal';
import Like from './Like';
import Save from './Save';
import { useAuthContext } from '../../../navigation/AuthProvider';

const Actions = ({ postOwner, postId }) => {

    const { isDarkMode } = useAuthContext();
    const [commentCount, setCommentCount] = useState("");

    const { data: getPost_data } = useQuery(getPostActions, {
        variables: {
            _id: postId
        },
        fetchPolicy: 'network-only',
    });

    const [postData, setPostData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const editCommentCount = async () => {
        if (postData.Comment >= 1000000000) {
            // Milyarlar
            setCommentCount((postData.Comment / 1000000000).toFixed(0) + ' B ');
        } else if (postData.Comment >= 1000000) {
            // Milyonlar
            setCommentCount((postData.Comment / 1000000).toFixed(0) + ' M ');
        } else if (postData.Comment >= 1000) {
            // Binler
            setCommentCount((postData.Comment / 1000).toFixed(0) + ' K ');
        } else {
            setCommentCount(postData.Comment.toString());
        }
    }

    useEffect(() => {
        if (getPost_data) {
            setPostData(getPost_data.post);
        }
    }, [getPost_data]);

    useEffect(() => {

        if (postData) {
            editCommentCount();
        }

    }, [postData])


    if (postData) {
        return (
            <View className="w-full h-auto px-2 flex flex-row mb-1 items-center">
                <View className="flex-1 flex flex-row space-x-4">
                    <View className="flex flex-row space-x-1">
                        <Like postId={postId} postOwner={postOwner} postData={postData} />

                        <Modal isVisible={isModalVisible}>
                            <CommentModal postOwner={postOwner} postId={postId} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
                        </Modal>
                    </View>

                    <TouchableOpacity onPress={() => toggleModal()} className="flex flex-row space-x-1 items-center">
                        <IconOI name="comment" size={24} color={isDarkMode ? "white" : "black"} />
                        <Text>
                            {commentCount}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Save postId={postId} />
            </View>
        );
    }
}
export default Actions;