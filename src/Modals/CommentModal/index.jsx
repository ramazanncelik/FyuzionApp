import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { createComment } from '../../apollo/Comment/commentMutations';
import { useAuthContext } from '../../navigation/AuthProvider';
import { language } from '../../utils/utils';
import { getPostActions, getPostCommentIsClosed } from '../../apollo/Post/postQueries';
import { getComments } from '../../apollo/Comment/commentQueries';
import Comments from '../../components/Comments';
import { addNotification } from '../../apollo/Notification/notificationMutations';
import CustomLoading from '../../components/CustomLoading';

const CommentModal = ({ postOwner, postId, isModalVisible, setIsModalVisible }) => {

    const { isDarkMode, userId } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [commentsIsClosed, setCommentsIsClosed] = useState(false);
    const { loading: getComments_loading, data: getComments_data } = useQuery(getComments, {
        variables: {
            post_id: postId
        },
        fetchPolicy: 'network-only',
    });
    const { loading: getCommentsIsClosed_loading, data: getCommentsIsClosed_data } = useQuery(getPostCommentIsClosed, {
        variables: {
            _id: postId
        },
        fetchPolicy: 'network-only',
    });
    const [commentDescripton, setCommentDescripton] = useState("");
    const [addComment, { loading: createComment_loading }] = useMutation(createComment, {
        refetchQueries: [
            { query: getComments, variables: { post_id: postId } },
            { query: getPostCommentIsClosed, variables: { _id: postId } },
            { query: getPostActions, variables: { _id: postId } }
        ]
    });
    const [createNotification, { loading: addNotification_loading }] = useMutation(addNotification);

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

        const result = await addComment({
            variables: {
                data: {
                    OwnerId: userId,
                    PostId: postId,
                    Description: commentDescripton,
                    Like: 0,
                    Date: today,
                    Time: time,
                }
            }
        });
        if (result) {
            if (result.data) {
                setCommentDescripton("");
            }
        }
        if (userId !== postOwner) {
            await createNotification({
                variables: {
                    data: {
                        From: userId,
                        To: postOwner,
                        Type: "comment",
                        PostId: postId,
                        Date: today,
                        Time: time,
                    }
                }
            });
        }
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {

        if (getComments_data) {
            setComments(getComments_data.comments)
        } else {
            setComments([]);
        }

    }, [getComments_data]);

    useEffect(() => {

        if (getCommentsIsClosed_data) {
            setCommentsIsClosed(getCommentsIsClosed_data.post.CommentsIsClosed)
        } else {
            setCommentsIsClosed(false)
        }

    }, [getCommentsIsClosed_data]);

    return (
        <View className="h-[75%] flex flex-col p-2 bg-white dark:bg-gray-700 rounded-lg ml-2">
            <View className="w-full h-auto items-end mb-5">
                <Text onPress={() => toggleModal()} className="text-black dark:text-white font-bold">
                    {language.includes("tr") ? "Kapat   " : "Close   "}X
                </Text>
            </View>

            {(getComments_loading || getCommentsIsClosed_loading) ?
                <CustomLoading type={"ball"} indicatorSize={36} indicatorColor={isDarkMode ? "white" : "black"} className={"flex-1 flex-col items-center justify-center space-y-1"} />
                :
                <Comments comments={comments} postOwner={postOwner} />}

            {commentsIsClosed ?
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Gönderi Yorumlara Kapalı" : "Post Closed for Comments"}
                    </Text>
                </View>
                :
                <View className="flex flex-col justify-end">
                    <View className="w-full flex flex-row space-x-2">
                        <TextInput
                            className={`flex-1 bg-white border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block p-2 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500`}
                            name="Description"
                            placeholder={language.includes("tr") ? "Yorumunuz" : "Your Comment"}
                            value={commentDescripton}
                            onChangeText={value => setCommentDescripton(value)}
                        />

                        {createComment_loading ?
                            <CustomLoading type={"pacman"} indicatorSize={24} indicatorColor={"white"} className={"py-2 px-4 ml-2 bg-blue-400 rounded-lg items-center justify-center"} />
                            :
                            <TouchableOpacity disabled={!commentDescripton || createComment_loading} onPress={handleSubmit} className={`p-2 ${commentDescripton ? "bg-blue-500" : "bg-blue-400"} rounded-lg items-center justify-center`}>
                                <Text className="text-white font-bold">
                                    {language.includes("tr") ? "Paylaş" : "Share"}
                                </Text>
                            </TouchableOpacity>}
                    </View>
                </View>}
        </View>
    );
}

export default CommentModal;