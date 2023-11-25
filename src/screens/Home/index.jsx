import { View, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl } from "react-native"
import React, { useState, useEffect } from "react"
import IconII from 'react-native-vector-icons/Ionicons'
import IconAD from 'react-native-vector-icons/AntDesign'
import { useNavigation } from "@react-navigation/native"
import { useAuthContext } from "../../navigation/AuthProvider"
import { useLazyQuery, useQuery } from "@apollo/client"
import { getMyFolloweds } from "../../apollo/Connection/connectionQeries"
import { getTargetUserPosts } from "../../apollo/TargetUserPost/targetUserPostQueries"
import { language } from "../../utils/utils"
import Post from "../../components/Post"
import CustomLoading from "../../components/CustomLoading"

const Home = () => {

  const { isDarkMode, userId } = useAuthContext();
  const navigation = useNavigation();
  const [myFollowedsPosts, setMyFollowedsPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loading: getMyFolloweds_loading, data: getMyFolloweds_data, refetch: getFolloweds_refetch } = useQuery(getMyFolloweds, {
    variables: {
      user_id: userId
    }
  });
  const [getMyFollowedPosts, { loading: getMyFollowedPosts_loading }] = useLazyQuery(getTargetUserPosts,{
    fetchPolicy:"no-cache"
  });

  const getMyFolllowedsPosts = async (myFolloweds) => {
    const list = [];
    const postListData = [];
    for (let j = 0; j < myFolloweds.length; j++) {
      const { data: userPostData } = await getMyFollowedPosts({
        variables: {
          user_id: myFolloweds[j].toUser._id
        }
      });
      if (userPostData) {
        await userPostData.posts.map(post => {
          list.push(post);
        })
      }
    }

    Object.assign(postListData, list);
    postListData.sort((a, b) => { return (b.Time) - (a.Time) });
    setMyFollowedsPosts(postListData);
  }

  const renderItem = ({ item }) => (
    <React.Fragment>
      <Post postId={item._id} />
    </React.Fragment>
  );

  const onRefresh = () => {
    setRefreshing(true);

    if (getMyFolloweds_data) {
      getMyFolllowedsPosts(getMyFolloweds_data.myFolloweds)
    }

    setRefreshing(false);
  }

  useEffect(() => {

    getFolloweds_refetch({
      user_id: userId
    });

  }, [getFolloweds_refetch]);

  useEffect(() => {

    if (getMyFolloweds_data) {
      getMyFolllowedsPosts(getMyFolloweds_data.myFolloweds)
    }

  }, [getMyFolloweds_data]);

  if (!getMyFolloweds_loading && !getMyFollowedPosts_loading) {
    return (
      <SafeAreaView className="h-full flex flex-col space-y-2 bg-white dark:bg-gray-700 pt-2">

        <View className="w-full h-auto flex flex-row items-center px-2">
          <Text className="flex-1 text-lg text-black dark:text-white font-bold">Fyuzion</Text>
          <View className="flex flex-row space-x-5">
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <IconII name="notifications-outline" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
              <IconAD name="message1" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
          </View>
        </View>

        {myFollowedsPosts.length !== 0 &&
          <FlatList className="w-full"
            data={myFollowedsPosts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          /> ||
          <View className="flex-1 flex-col space-y-3 items-center justify-center">
            <Text className="text-lg text-gray-400 text-center">
              {language.includes("tr") ? "Takip ettiğiniz kullanıcıların henüz paylaştığı bir gönderi bulunmamaktadır" : "There are no posts shared by the users you follow yet"}
            </Text>
          </View>}

      </SafeAreaView>
    )
  } else {
    return (
      <CustomLoading type={"ball"} indicatorSize={24} indicatorColor={isDarkMode ? "white" : "black"} className={"h-full flex flex-col space-y-2 bg-white dark:bg-gray-700 pt-2"} />
    )
  }
}

export default Home