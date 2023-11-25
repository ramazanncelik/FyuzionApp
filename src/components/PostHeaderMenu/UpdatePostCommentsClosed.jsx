import { View, Text, TouchableOpacity, useColorScheme } from "react-native"
import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { updatePost } from "../../apollo/Post/postMutations"
import { getPostCommentIsClosed } from "../../apollo/Post/postQueries"
import { language } from "../../utils/utils"
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import { BallIndicator } from 'react-native-indicators'

const UpdatePostCommentsClosed = ({ postId, setIsModalVisible }) => {

    const isDarkMode = useColorScheme() === 'dark';
    const [commentsIsClosed, setCommentsIsClosed] = useState(false);

    const { loading: getCommentsIsClosed_loading, data: getCommentsIsClosed_data } = useQuery(getPostCommentIsClosed, {
        variables: {
            _id: postId
        },
        fetchPolicy: 'network-only',
    });

    const [changePostData, { loading: updatePost_loading }] = useMutation(updatePost, {
        refetchQueries: [
            { query: getPostCommentIsClosed, variables: { _id: postId } }
        ]
    });

    const postUpdateSubmit = async () => {
        await changePostData({
            variables: {
                post_id: postId,
                data: {
                    CommentsIsClosed: !commentsIsClosed
                }
            }
        })
    }

    useEffect(() => {

        if (getCommentsIsClosed_data) {
            if (getCommentsIsClosed_data.post) {
                setCommentsIsClosed(getCommentsIsClosed_data.post.CommentsIsClosed);
            } else {
                setCommentsIsClosed(false);
            }
        } else {
            setCommentsIsClosed(false);
        }

    }, [getCommentsIsClosed_data]);

    if (getCommentsIsClosed_loading || updatePost_loading) {
        return (
            <View className="w-full bg-white dark:bg-gray-700 p-10 items-center justify-center">
                <BallIndicator color={isDarkMode ? "white" : "black"} size={20} />
            </View>
        )
    } else {
        if (commentsIsClosed) {
            return (
                <TouchableOpacity disabled={getCommentsIsClosed_loading || updatePost_loading} className="w-full border-b border-gray-300 dark:border-gray-400 p-3 flex flex-row space-x-5 items-center" onPress={() => postUpdateSubmit()}>
                    <IconMCI name='comment-check' color={isDarkMode ? "white" : "black"} size={20} />

                    <Text className="text-black dark:text-white text-sm">
                        {language.includes("tr") ? "Yorumları Aç" : "Open Comments"}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity disabled={getCommentsIsClosed_loading || updatePost_loading} className="w-full border-b border-gray-300 dark:border-gray-400 p-3 flex flex-row space-x-5 items-center" onPress={() => postUpdateSubmit()}>
                    <IconMCI name='comment-off' color={isDarkMode ? "white" : "black"} size={20} />

                    <Text className="text-black dark:text-white text-sm">
                        {language.includes("tr") ? "Yorumları Kapat" : "Close Comments"}
                    </Text>
                </TouchableOpacity>
            )
        }
    }
}

export default UpdatePostCommentsClosed