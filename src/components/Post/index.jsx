import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/client';
import { getPost } from '../../apollo/Post/postQueries';
import Header from '../../components/Post/Header';
import Actions from '../../components/Post/Actions';
import Description from '../../components/Post/Description';
import Files from '../../components/Post/Files';
import PostDate from '../../components/Post/PostDate';
import CustomLoading from '../CustomLoading';
import { useAuthContext } from '../../navigation/AuthProvider';

const Post = ({ postId }) => {

    const { isDarkMode } = useAuthContext();

    const { data, refetch } = useQuery(getPost, {
        variables: {
            _id: postId
        }
    });

    const [postData, setPostData] = useState(null);

    useEffect(() => {
        if (data) {
            setPostData(data.post);
        }
    }, [data]);

    useEffect(() => {
        refetch({
            _id: postId
        });
    }, [postId]);

    if (postData) {
        return (
            <View className="w-full h-auto flex flex-col">
                <Header postFiles={postData.Files} postId={postData._id} postOwner={postData.user} />
                {postData.Files.length === 0 ?
                    <>
                        <Description Description={postData.Description} />
                        <Actions postId={postData._id} postOwner={postData.user._id} />
                    </>
                    :
                    <>
                        <Files  postData={postData} />
                        <Actions postId={postData._id} postOwner={postData.user._id} />
                        <Description Description={postData.Description} />
                    </>
                }
                <PostDate postData={postData} />
            </View>
        );
    } else {
        return (
            <CustomLoading type={"ball"} indicatorSize={24} indicatorColor={isDarkMode ? "white" : "black"} className={"flex-1 py-3 border border-gray-300 dark:border-slate-500 my-2 mx-2 rounded-lg"} />
        )
    }
}

export default Post;