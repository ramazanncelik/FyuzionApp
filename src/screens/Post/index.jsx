import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import IconAntD from "react-native-vector-icons/AntDesign"
import { language } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from '@apollo/client';
import { getPost } from '../../apollo/Post/postQueries';
import PostComponent from '../../components/Post';
import Loading from '../../components/Loading';
import { useAuthContext } from '../../navigation/AuthProvider';

const Post = ({ route }) => {

    const { postId } = route.params;
    const { data, refetch } = useQuery(getPost, {
        variables: {
            _id: postId
        }
    });

    const [postData, setPostData] = useState(null);

    const { isDarkMode } = useAuthContext();
    const navigation = useNavigation();

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
            <SafeAreaView className="h-full bg-white dark:bg-gray-700 flex flex-col space-y-2">
                <TouchableOpacity onPress={() => navigation.goBack()}
                    className="flex flex-row space-x-3 items-center p-2">
                    <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                    <Text className="text-lg text-black dark:text-white">
                        {language.includes("tr") ? "Geri" : "Back"}
                    </Text>
                </TouchableOpacity>

                <PostComponent postId={postId} />

            </SafeAreaView>
        );
    } else {
        return <Loading />
    }
}

export default Post;