import { View, Text, TouchableOpacity, useColorScheme } from "react-native"
import { language } from "../../utils/utils"
import { useMutation } from "@apollo/client"
import { deleteAllPostLike } from "../../apollo/PostLike/postLikeMutations"
import { deleteAllComment } from "../../apollo/Comment/commentMutations"
import { deletePost } from "../../apollo/Post/postMutations"
import { useAuthContext } from "../../navigation/AuthProvider"
import { useNavigation } from "@react-navigation/native"
import { BallIndicator } from 'react-native-indicators';
import IconE from 'react-native-vector-icons/Entypo'
import storage from '@react-native-firebase/storage';

const DeletePost = ({ postId, postFiles, setIsModalVisible }) => {

    const { isDarkMode } = useAuthContext();
    const navigation = useNavigation();

    const [removePost, { loading: removePost_loading }] = useMutation(deletePost);
    const [removeAllPostLike, { loading: removeAllPostLike_loading }] = useMutation(deleteAllPostLike);
    const [removeAllComment, { loading: removeAllComment_loading }] = useMutation(deleteAllComment);

    const postDeleteSubmit = async () => {
        await removePost({
            variables: {
                post_id: postId
            }
        });

        await removeAllPostLike({
            variables: {
                post_id: postId
            }
        });

        await removeAllComment({
            variables: {
                post_id: postId
            }
        });

        if (postFiles.length !== 0) {
            for (let i = 0; i < postFiles.length; i++) {
                await storage().ref(postFiles[i].FilePath).delete();
            }
        }

        navigation.goBack();
        setIsModalVisible(false)
    }

    if (removePost_loading || removeAllComment_loading || removeAllPostLike_loading) {
        return (
            <View className="w-full border-b border-gray-300 dark:border-gray-400 bg-white dark:bg-gray-700 p-10 items-center justify-center">
                <BallIndicator color={isDarkMode ? "white" : "black"} size={20} />
            </View>
        )
    } else {
        return (
            <TouchableOpacity className="w-full border-b border-gray-300 dark:border-gray-400 p-3 flex flex-row space-x-5 items-center" onPress={() => postDeleteSubmit()}>
                <IconE name='trash' size={24} color={'red'} />

                <Text className="text-red-500 text-sm">
                    {language.includes("tr") ? "Gönderiyi Sil" : "Delete Post"}
                </Text>
            </TouchableOpacity>
        )
    }
}

export default DeletePost