import { View, FlatList, Text, SafeAreaView, TouchableOpacity, RefreshControl } from "react-native"
import React, { useState, useEffect } from "react"
import IconMI from 'react-native-vector-icons/MaterialIcons'
import { language } from "../../utils/utils"
import { useNavigation } from "@react-navigation/native"
import { useLazyQuery, useQuery } from "@apollo/client"
import { getAllUser } from "../../apollo/User/userQueries"
import { getTargetUserPosts } from "../../apollo/TargetUserPost/targetUserPostQueries"
import PostInfo from "../../components/PostInfo"
import CustomLoading from "../../components/CustomLoading"
import { useAuthContext } from "../../navigation/AuthProvider"

const Explore = () => {

  const { isDarkMode } = useAuthContext();
  const navigation = useNavigation();

  const [allPosts, setAllPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loading: getAllUser_loading, data, refetch } = useQuery(getAllUser);
  const [getAllUserPosts, { loading: getAllUserPosts_loading }] = useLazyQuery(getTargetUserPosts);

  const getAllPosts = async (allUser) => {
    const list = [];
    const postListData = [];
    for (let j = 0; j < allUser.length; j++) {
      const { data: userPostData } = await getAllUserPosts({
        variables: {
          user_id: allUser[j]._id
        }
      });
      if (userPostData) {
        await userPostData.posts.map(post => {
          list.push(post._id);
        })
      }
    }
    Object.assign(postListData, list);
    postListData.sort(function (a, b) { return 0.5 - Math.random() });
    setAllPosts(postListData);
  }

  const renderItem = ({ item }) => (
    <React.Fragment>
      <PostInfo postId={item} />
    </React.Fragment>
  );

  useEffect(() => {

    if (data) {
      const allUsers = data.users.filter(user => user.IsPrivate === false);
      getAllPosts(allUsers);
    }

  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);

    if (data) {
      const allUsers = data.users.filter(user => user.IsPrivate === false);
      getAllPosts(allUsers);
    }

    setRefreshing(false);
  }

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!getAllUser_loading && !getAllUserPosts_loading) {
    return (
      <SafeAreaView className="h-full flex flex-col space-y-2 bg-white dark:bg-gray-700 px-2 pt-2">
        <TouchableOpacity onPress={() => navigation.navigate("Search")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 flex flex-row space-x-3 items-center">
          <IconMI name='search' size={20} />
          <Text className="flex-1">
            {language.includes("tr") ? "Ara" : "Search"}
          </Text>
        </TouchableOpacity>

        {allPosts.length !== 0 &&
          <FlatList className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            numColumns={3}
            data={allPosts}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          /> ||
          <View className="w-full bg-blue-200 p-3 rounded-lg">
            <Text className="w-full text-blue-700">
              {language.includes("tr") ? "Uygulama İçerisinde Henüz Herhangi Bir Gönderi Paylaşılmamıştır veya Bütün Kullanıcılar Hesabını Gizliye Aldı." : "No Post Has Been Shared Yet In The Application Or All Users Have Private Accounts."}
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

export default Explore