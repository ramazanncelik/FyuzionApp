import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconFA5 from "react-native-vector-icons/FontAwesome5"
import IconII from "react-native-vector-icons/Ionicons"
import { useLazyQuery } from "@apollo/client";
import { getCurrentUser } from "../apollo/User/userQueries";
import FastImage from "react-native-fast-image";
import { useAuthContext } from "./AuthProvider";
import { setUserData, setUserPostsData } from "../utils/utils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Explore from "../screens/Explore";
import Profile from "../screens/Profile";
import ProfileEdit from "../screens/ProfileEdit";
import Post from "../screens/Post";
import { getPosts } from "../apollo/Post/postQueries";
import Search from "../screens/Search";
import TargetUser from "../screens/TargetUser";
import Loading from "../components/Loading";
import Notifications from "../screens/Notifications";
import Menu from "../screens/Menu";
import SavedPosts from "../screens/SavedPosts";
import Messages from "../screens/Messages";
import Chats from "../screens/Chats";
import { userUpdated } from "../apollo/User/userSubscriptions";
import { postCreated, postDeleted } from "../apollo/Post/postSubscriptions";
import ComplaintModal from "../Modals/ComplaintModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const { userId, isDarkMode } = useAuthContext();

  const [getCurrentUserData, { data: user_data, subscribeToMore: user_subscribeToMore }] = useLazyQuery(getCurrentUser);
  const [getCurrentUserPosts, { data: post_data, subscribeToMore: post_subscribeToMore }] = useLazyQuery(getPosts);
  const [currentUser, setCurrentUser] = useState(null)

  const getUser = async () => {
    const user = await getCurrentUserData({
      variables: {
        _id: userId
      }
    });
    if (user) {
      setCurrentUser(user.data.user);
      setUserData(user.data.user);
    }
  }

  const getUserPosts = async () => {
    const posts = await getCurrentUserPosts({
      variables: {
        user_id: userId
      }
    });
    if (posts) {
      if (posts.data) {
        if (posts.data.posts) {
          setUserPostsData(posts.data.posts)
        }
      }
    }
  }

  useEffect(() => {

    if (userId) {
      getUser();
      getUserPosts();
    }

  }, [userId]);

  useEffect(() => {

    if (user_data) {
      if (user_data.user) {
        setCurrentUser(user_data.user);
        setUserData(user_data.user);
      }
    }

  }, [user_data]);

  useEffect(() => {
    if (post_data) {
      if (post_data.posts) {
        setUserPostsData(post_data.posts);
      }
    }

  }, [post_data]);

  useEffect(() => {

    user_subscribeToMore({
      document: userUpdated,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const updatedUser = subscriptionData.data.userUpdated;

        return {
          user: updatedUser
        }
      }
    });

  }, [user_subscribeToMore]);

  useEffect(() => {

    post_subscribeToMore({
      document: postCreated,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newPost = subscriptionData.data.postCreated;

        return {
          posts: [
            ...prev.posts,
            newPost
          ]
        }
      }
    });

    post_subscribeToMore({
      document: postDeleted,
      variables: { user_id: userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const allPosts = prev.posts;
        const deletedPost = subscriptionData.data.postDeleted;
        console.log(deletedPost)
        const allPostsData = allPosts.filter(post => post._id !== deletedPost._id);

        return {
          posts: [...allPostsData]
        }
      }
    });

  }, [post_subscribeToMore]);

  const TabStack = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return <IconFA5 name="home" size={size} color={color} />;
            } else if (route.name === "Explore") {
              return <IconII name="search" size={size} color={color} />;
            } else if (route.name === "Profile") {
              return <FastImage
                className={`${focused ? "w-10 h-10" : "w-8 h-8"} rounded-full`}
                source={{
                  uri: currentUser.ImageUrl,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />;
            }
          },
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            backgroundColor: isDarkMode ? "#374151" : "white",
          },
        })}>
        <Tab.Screen name="Home" component={Home} options={{ headerShown: false, tabBarShowLabel: false }} />
        <Tab.Screen name="Explore" component={Explore} options={{ headerShown: false, tabBarShowLabel: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false, tabBarShowLabel: false }} />
      </Tab.Navigator>
    );
  }

  if (currentUser) {
    return (
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={TabStack}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ExploreScreen"
          component={Explore}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEdit}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Post"
          component={Post}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="TargetUser"
          component={TargetUser}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SavedPosts"
          component={SavedPosts}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Chats"
          component={Chats}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Messages"
          component={Messages}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ComplaintModal"
          component={ComplaintModal}
          options={{
            headerShown: false,
            presentation: 'containedTransparentModal',
          }}
        />

      </Stack.Navigator>
    )
  } else {
    return <Loading />
  }
}