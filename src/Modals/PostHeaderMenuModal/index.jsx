import { View } from "react-native"
import React from "react"
import IconII from 'react-native-vector-icons/Ionicons'
import DeletePost from "../../components/PostHeaderMenu/DeletePost"
import UpdatePostCommentsClosed from "../../components/PostHeaderMenu/UpdatePostCommentsClosed"
import CreateComplaint from "../../components/PostHeaderMenu/CreateComplaint"
import { useAuthContext } from "../../navigation/AuthProvider"

const PostHeaderMenu = ({ postOwner, postId, postFiles, setIsModalVisible }) => {

  const { userId } = useAuthContext();

  return (
    <View className="w-96 h-auto flex flex-col space-y-1 bg-white dark:bg-slate-700 rounded-t-lg">

      <View className="w-full items-center justify-center">
        <IconII name='remove-outline' size={40} />
      </View>

      {userId === postOwner &&
        <DeletePost postId={postId} postFiles={postFiles} setIsModalVisible={setIsModalVisible} />}
      {userId === postOwner &&
        <UpdatePostCommentsClosed postId={postId} postFiles={postFiles} setIsModalVisible={setIsModalVisible} />}
      <CreateComplaint postId={postId} setIsModalVisible={setIsModalVisible} />

    </View>
  )
}

export default PostHeaderMenu;