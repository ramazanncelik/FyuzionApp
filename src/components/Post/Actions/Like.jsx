import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconII from 'react-native-vector-icons/Ionicons'
import { addPostLike, deletePostLike } from '../../../apollo/PostLike/postLikeMutations';
import { getPostActions } from '../../../apollo/Post/postQueries';
import { useAuthContext } from '../../../navigation/AuthProvider';
import { postLiked } from '../../../apollo/PostLike/postLikeQueries';
import { addNotification } from '../../../apollo/Notification/notificationMutations';

const Like = ({ postId, postOwner, postData }) => {

    const { userId } = useAuthContext();
    const [likeId, setLikeId] = useState(null);
    const [likeCount, setLikeCount] = useState("");

    const likedPostRefetchQueries = [
        { query: getPostActions, variables: { _id: postId } },
        {
            query: postLiked, variables: {
                data: {
                    OwnerId: userId,
                    PostId: postId
                }
            }
        }
    ];

    const [createLike, { loading: createLike_loading }] = useMutation(addPostLike, {
        refetchQueries: likedPostRefetchQueries
    });
    const [removeLike, { loading: removeLike_loading }] = useMutation(deletePostLike, {
        refetchQueries: likedPostRefetchQueries
    });
    const { data: getLike_data } = useQuery(postLiked, {
        variables: {
            data: {
                OwnerId: userId,
                PostId: postId
            }
        }
    });
    const [createNotification, { loading: addNotification_loading }] = useMutation(addNotification);

    const likePost = async () => {
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

        if (likeId) {
            await removeLike({
                variables: {
                    like_id: likeId
                }
            });

        } else {
            await createLike({
                variables: {
                    data: {
                        OwnerId: userId,
                        PostId: postId
                    }
                }
            });
            if (userId !== postOwner) {
                await createNotification({
                    variables: {
                        data: {
                            From: userId,
                            To: postOwner,
                            Type: "postLike",
                            PostId: postId,
                            Date: today,
                            Time: time,
                        }
                    }
                });
            }
        }
    }

    const editLikeCount = async () => {
        if (postData.Like >= 1000000000) {
            // Milyarlar
            setLikeCount((postData.Like / 1000000000).toFixed(0) + ' B ');
        } else if (postData.Like >= 1000000) {
            // Milyonlar
            setLikeCount((postData.Like / 1000000).toFixed(0) + ' M ');
        } else if (postData.Like >= 1000) {
            // Binler
            setLikeCount((postData.Like / 1000).toFixed(0) + ' K ');
        } else {
            setLikeCount(postData.Like.toString());
        }
    }

    useEffect(() => {
        if (getLike_data) {
            if (getLike_data.postLike) {
                setLikeId(getLike_data.postLike._id);
            } else {
                setLikeId(null);
            }
        }
    }, [getLike_data]);

    useEffect(() => {

        editLikeCount();

    }, [postData])


    return (
        <View className="flex flex-row space-x-1 items-center">
            <TouchableOpacity disabled={addNotification_loading || createLike_loading || removeLike_loading} onPress={() => likePost()}>
                {likeId &&
                    <IconII name="heart" size={24} color={'red'} /> ||
                    <IconII name="heart-outline" size={24} />}
            </TouchableOpacity>
            <Text>
                {likeCount}
            </Text>
        </View>
    )
}

export default Like