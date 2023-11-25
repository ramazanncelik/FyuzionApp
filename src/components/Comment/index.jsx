import { View } from 'react-native'
import { useState, useEffect } from 'react'
import Header from './Header'
import Main from './Main'
import Like from './Actions/Like'
import CommentDate from './CommentDate'
import { getComment } from '../../apollo/Comment/commentQueries'
import CustomLoading from '../CustomLoading'
import { useAuthContext } from '../../navigation/AuthProvider'
import { useQuery } from '@apollo/client'

const Comment = ({ comment, postOwner }) => {

    const { isDarkMode } = useAuthContext();
    const [commentData, setCommentData] = useState(null);

    const { loading: getComment_loading, data: getComment_data } = useQuery(getComment, {
        variables: {
            _id: comment._id
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (getComment_data) {
            if (getComment_data.comment) {
                setCommentData(getComment_data.comment);
            }
        }

        return () => {
            setCommentData(null);
        }
    }, [getComment_data])


    if (!getComment_loading && commentData) {
        return (
            <View key={commentData._id} className="w-full flex flex-row space-x-2 mb-3">
                <View className="flex-1 flex-col space-y-1">
                    <Header postOwner={postOwner} postId={commentData.PostId} commentId={commentData._id} commentOwner={commentData.user} />
                    <Main commentData={commentData} />
                    <View className="w-full flex flex-row space-x-2 px-2">
                        <Like commentId={commentData._id} commentOwner={commentData.OwnerId} commentData={commentData} />
                        <CommentDate commentData={commentData} />
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <CustomLoading
                type={"ball"}
                indicatorSize={24}
                indicatorColor={isDarkMode ? "white" : "black"}
                className={"flex-1 py-3 border border-gray-300 dark:border-slate-500 my-2 mx-2 rounded-lg"} />
        )
    }
}

export default Comment