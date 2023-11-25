import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconII from 'react-native-vector-icons/Ionicons'
import { addCommentLike, deleteCommentLike } from '../../../apollo/CommentLike/commentLikeMutations';
import { getComment } from '../../../apollo/Comment/commentQueries';
import { useAuthContext } from '../../../navigation/AuthProvider';
import { commentLiked } from '../../../apollo/CommentLike/commentLikeQueries';
import { addNotification } from '../../../apollo/Notification/notificationMutations';

const Like = ({ commentId, commentOwner, commentData }) => {

    const { userId } = useAuthContext();
    const [likeId, setLikeId] = useState(null);
    const [likeCount, setLikeCount] = useState("");

    const likedCommentRefetchQueries = [
        { query: getComment, variables: { _id: commentId } },
        {
            query: commentLiked, variables: {
                data: {
                    OwnerId: userId,
                    CommentId: commentId
                }
            }
        }
    ];

    const [createLike, { loading: createLike_loading }] = useMutation(addCommentLike, {
        refetchQueries: likedCommentRefetchQueries
    });
    const [removeLike, { loading: removeLike_loading }] = useMutation(deleteCommentLike, {
        refetchQueries: likedCommentRefetchQueries
    });
    const { data: getLike_data } = useQuery(commentLiked, {
        variables: {
            data: {
                OwnerId: userId,
                CommentId: commentId
            }
        }
    });
    const [createNotification, { loading: addNotification_loading }] = useMutation(addNotification);

    const likeComment = async () => {
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
                        CommentId: commentId
                    }
                }
            });
            if (userId !== commentOwner) {
                await createNotification({
                    variables: {
                        data: {
                            From: userId,
                            To: commentOwner,
                            Type: "commentLike",
                            CommentId: commentId,
                            Date: today,
                            Time: time,
                        }
                    }
                });
            }
        }
    }

    const editLikeCount = async () => {
        if (commentData.Like >= 1000000000) {
            // Milyarlar
            setLikeCount((commentData.Like / 1000000000).toFixed(0) + ' B ');
        } else if (commentData.Like >= 1000000) {
            // Milyonlar
            setLikeCount((commentData.Like / 1000000).toFixed(0) + ' M ');
        } else if (commentData.Like >= 1000) {
            // Binler
            setLikeCount((commentData.Like / 1000).toFixed(0) + ' K ');
        } else {
            setLikeCount(commentData.Like.toString());
        }
    }

    useEffect(() => {
        if (getLike_data) {
            if (getLike_data.commentLike) {
                setLikeId(getLike_data.commentLike._id);
            } else {
                setLikeId(null);
            }
        }
    }, [getLike_data]);

    useEffect(() => {

        editLikeCount();

    }, [commentData]);

    return (
        <View className="flex flex-1 flex-row space-x-1 items-center">
            <TouchableOpacity disabled={addNotification_loading || createLike_loading || removeLike_loading} onPress={() => likeComment()}>
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