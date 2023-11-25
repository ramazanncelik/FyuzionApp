import { View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import IconAntD from 'react-native-vector-icons/AntDesign'
import IconMI from 'react-native-vector-icons/MaterialIcons'
import { language } from '../../utils/utils'
import { useQuery } from '@apollo/client'
import { getAllUser } from '../../apollo/User/userQueries'
import Loading from '../../components/Loading'
import SearchUser from '../../components/SearchUser'
import { useAuthContext } from '../../navigation/AuthProvider'

const Search = () => {

    const { userId, isDarkMode } = useAuthContext();
    const navigation = useNavigation();
    const { loading, data } = useQuery(getAllUser);
    const [allUsers, setAllUsers] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [wantedUsers, setWantedUsers] = useState([]);

    const renderItem = ({ item }) => (
        <React.Fragment>
            <SearchUser searchUser={item} />
        </React.Fragment>
    );

    useEffect(() => {

        if (searchText) {
            const wantedUsers = allUsers.filter(user => (user.NickName.includes(searchText) || user.Name.includes(searchText)) && user._id !== userId);
            setWantedUsers(wantedUsers);
        } else {
            setWantedUsers([]);
        }

    }, [searchText]);

    useEffect(() => {
        if (data) {
            setAllUsers(data.users);
        }
    }, [data]);

    if (!loading) {
        return (
            <SafeAreaView className="h-full flex flex-col space-y-5 bg-white dark:bg-gray-700 px-2 pt-2">

                <View className="w-full flex flex-row space-x-5 items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()}
                        className="flex flex-row">
                        <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
                    </TouchableOpacity>

                    <View className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-2 items-center flex-row space-x-3">
                        <IconMI name='search' size={20} color={isDarkMode ? "white" : "black"} />
                        <TextInput className="flex-1 text-lg"
                            autoFocus={true}
                            placeholder={language.includes("tr") ? "Ara" : "Search"}
                            onChangeText={value => setSearchText(value)}
                        />
                    </View>
                </View>

                {searchText && wantedUsers.length === 0 ?
                    <View className="w-full p-3 bg-blue-500 rounded-lg">
                        <Text className="text-white font-bold">
                            {language.includes("tr") ? "Kullanıcı bulunamadı" : "User not found"}
                        </Text>
                    </View>
                    :
                    <FlatList className="flex-1"
                        data={wantedUsers}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    />}

            </SafeAreaView>
        );
    } else {
        return <Loading />;
    }
}

export default Search