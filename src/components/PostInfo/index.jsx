import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getPost } from '../../apollo/Post/postQueries';
import { useAuthContext } from '../../navigation/AuthProvider';
import CustomLoading from '../CustomLoading';

const PostInfo = ({ postId }) => {

    const { isDarkMode } = useAuthContext();
    const navigation = useNavigation();
    const [postData, setPostData] = useState(null)

    const { data } = useQuery(getPost, {
        variables: {
            _id: postId
        }
    });

    useEffect(() => {

        if (data) {
            if (data.post) {
                setPostData(data.post);
            } else {
                setPostData(null);
            }
        } else {
            setPostData(null);
        }

    }, [data]);


    if (postData) {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Post", {
                        postId: postData._id
                    })
                }}
                className={`w-[31.3%] h-32 m-1 ${postData.Files.length === 0 && "p-1 border border-gray-500"} rounded-lg`}>
                {postData.Files.length !== 0 ?
                    <FastImage
                        className="w-full h-full rounded-lg"
                        source={{
                            uri: "" + postData.Files[0].FileUrl,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    :
                    <Text className="w-full text-black dark:text-white">
                        {postData.Description}
                    </Text>}

            </TouchableOpacity>
        );
    } else {
        return (
            <CustomLoading type={"ball"} indicatorSize={16} indicatorColor={isDarkMode ? "white" : "black"} className={"w-[31.3%] h-32 m-1 border border-gray-500 rounded-lg"} />
        )
    }
}
export default PostInfo;