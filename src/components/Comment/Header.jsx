import { useMutation } from '@apollo/client';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { deleteComment } from '../../apollo/Comment/commentMutations';
import { getComments } from '../../apollo/Comment/commentQueries';
import { getPostActions, getPostCommentIsClosed } from '../../apollo/Post/postQueries';
import { language } from '../../utils/utils';
import { BallIndicator } from 'react-native-indicators';
import { useAuthContext } from '../../navigation/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const Header = ({ postOwner, postId, commentId, commentOwner }) => {

    const navigation = useNavigation();
    const { isDarkMode, userId } = useAuthContext();

    const [removeComment, { loading }] = useMutation(deleteComment, {
        refetchQueries: [
            { query: getPostActions, variables: { _id: postId } },
            { query: getComments, variables: { post_id: postId } },
            { query: getPostCommentIsClosed, variables: { _id: postId } },
        ]
    })

    const handleSubmit = async () => {
        await removeComment({
            variables: {
                comment_id: commentId
            }
        });
    }

    if (userId === commentOwner._id) {
        return (
            <View className="w-full h-auto flex flex-row space-x-2 px-2 mb-1 items-center">
                <View className="flex-1 flex-row space-x-2 items-center">
                    <FastImage
                        className="w-8 h-8 rounded-full"
                        source={{
                            uri: commentOwner.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <Text className="text-black dark:text-white text-sm">
                        {commentOwner.NickName}
                    </Text>
                </View>

                {loading ?
                    <View>
                        <BallIndicator size={20} color={isDarkMode ? "white" : "black"} />
                    </View>
                    :
                    <TouchableOpacity onPress={() => handleSubmit()}>
                        <Text className="text-red-500 text-sm">
                            {language.includes("tr") ? "Yorumu Sil" : "Delete Comment"}
                        </Text>
                    </TouchableOpacity>}
            </View>
        );
    } else {
        return (
            <View className="w-full h-auto flex flex-row space-x-2 px-2 mb-1 items-center">
                <TouchableOpacity onPress={() => navigation.navigate("TargetUser", { targetUserId: commentOwner._id })} className="flex-1 flex-row space-x-2 items-center">
                    <FastImage
                        className="w-8 h-8 rounded-full"
                        source={{
                            uri: commentOwner.ImageUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <Text className="text-black dark:text-white text-sm">
                        {commentOwner.NickName}
                    </Text>
                </TouchableOpacity>

                {loading ?
                    <View>
                        <BallIndicator size={20} color={isDarkMode ? "white" : "black"} />
                    </View>
                    :
                    userId == postOwner &&
                    <TouchableOpacity onPress={() => handleSubmit()}>
                        <Text className="text-red-500 text-sm">
                            {language.includes("tr") ? "Yorumu Sil" : "Delete Comment"}
                        </Text>
                    </TouchableOpacity>}
            </View>
        );
    }
}

export default Header