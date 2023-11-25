import { SafeAreaView, View, FlatList, TouchableOpacity, Text, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../navigation/AuthProvider'
import { useQuery } from '@apollo/client';
import { getSavedPosts } from '../../apollo/SavedPost/savedPostQueries';
import Loading from '../../components/Loading';
import { language } from '../../utils/utils';
import IconAntD from 'react-native-vector-icons/AntDesign'
import IconF from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import PostInfo from '../../components/PostInfo';

const SavedPosts = () => {

    const { isDarkMode, userId } = useAuthContext();
    const navigation = useNavigation();
    const [savedPosts, setSavedPosts] = useState(null);

    const { data } = useQuery(getSavedPosts, {
        variables: {
            user_id: userId
        }
    });

    const renderItem = ({ item }) => (
        <React.Fragment>
            <PostInfo postId={item.PostId} />
        </React.Fragment>
    );

    useEffect(() => {

        if (data) {
            if (data.savedPosts) {
                setSavedPosts(data.savedPosts);
            } else {
                setSavedPosts(null);
            }
        }

    }, [data]);


    if (savedPosts) {
        return (
            <SafeAreaView className="h-full bg-white dark:bg-gray-700 pt-2">

                <TouchableOpacity onPress={() => navigation.goBack()}
                    className="flex-row gap-3 items-center px-2 mb-5">
                    <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                    <Text className="text-lg text-black dark:text-white">
                        {language.includes("tr") ? "Kaydedilen Gönderiler" : "Saved Posts"}
                    </Text>
                </TouchableOpacity>

                {savedPosts.length !== 0 &&
                    <FlatList className="w-full px-2"
                        numColumns={3}
                        data={savedPosts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    /> ||
                    <View className="flex-1 flex-col space-y-3 items-center justify-center">
                        <IconF name="camera-off" size={100} color="#9ca3af" />
                        <Text className="text-lg text-gray-400">
                            {language.includes("tr") ? "Henüz Kaydettiğiniz Bir Gönderi Yok" : "No Posts You Have Saved Yet"}
                        </Text>
                    </View>}

            </SafeAreaView>
        )
    } else {
        return <Loading />
    }
}

export default SavedPosts