import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconII from 'react-native-vector-icons/Ionicons'
import { useAuthContext } from '../../../navigation/AuthProvider';
import { getSavedPost, getSavedPosts } from '../../../apollo/SavedPost/savedPostQueries';
import { addSavedPost, removeSavedPost } from '../../../apollo/SavedPost/savedPostMutation';

const Save = ({ postId }) => {

    const { isDarkMode, userId } = useAuthContext();
    const [saveId, setSaveId] = useState(null);

    const savedPostRefetchQueries = [
        { query: getSavedPosts, variables: { user_id: userId } },
        {
            query: getSavedPost, variables: {
                data: {
                    OwnerId: userId,
                    PostId: postId
                }
            }
        }
    ];

    const [createSavedPost, { loading: createSavedPost_loading }] = useMutation(addSavedPost, {
        refetchQueries: savedPostRefetchQueries
    });
    const [deleteSavedPost, { loading: removeSavedPost_loading }] = useMutation(removeSavedPost, {
        refetchQueries: savedPostRefetchQueries
    });
    const { data: getSavedPost_data } = useQuery(getSavedPost, {
        variables: {
            data: {
                OwnerId: userId,
                PostId: postId
            }
        }
    });

    const savePost = async () => {
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

        if (saveId) {
            await deleteSavedPost({
                variables: {
                    savedPost_id: saveId
                }
            });
        } else {
            await createSavedPost({
                variables: {
                    data: {
                        OwnerId: userId,
                        PostId: postId,
                        Date: today,
                        Time: time,
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (getSavedPost_data) {
            if (getSavedPost_data.savedPost) {
                setSaveId(getSavedPost_data.savedPost._id);
            } else {
                setSaveId(null);
            }
        }
    }, [getSavedPost_data]);

    return (
        <View>
            <TouchableOpacity disabled={createSavedPost_loading || removeSavedPost_loading} onPress={() => savePost()} className="flex flex-row space-x-1">
                {saveId &&
                    <IconII name="bookmark" size={24} color={isDarkMode ? "white" : "black"} /> ||
                    <IconII name="bookmark-outline" size={24} color={isDarkMode ? "white" : "black"} />}
            </TouchableOpacity>
        </View>
    )
}

export default Save