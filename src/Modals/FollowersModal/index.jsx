import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { language } from '../../utils/utils';
import { useAuthContext } from '../../navigation/AuthProvider';
import { useQuery } from '@apollo/client';
import { getFollowers } from '../../apollo/Connection/connectionQeries';
import Loading from '../../components/Loading';
import Followers from '../../components/Followers';

const FollowersModal = ({ isModalVisible, setIsModalVisible }) => {

    const { userId } = useAuthContext();
    const [followers, setFollowers] = useState([]);

    const { loading, data } = useQuery(getFollowers, {
        variables: { user_id: userId }
    })

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {

        if (data) {
            setFollowers(data.followers);
        } else {
            setFollowers([]);
        }

    }, [data]);

    if (!loading) {
        return (
            <View className="w-full h-[75%] bg-white dark:bg-slate-700 rounded-lg px-2 pt-2">
                <View className="w-full h-auto items-end mb-5">
                    <Text onPress={() => toggleModal()} className="text-black dark:text-white font-bold">
                        {language.includes("tr") ? "Kapat   " : "Close   "}X
                    </Text>
                </View>
                <Followers followers={followers} setIsModalVisible={setIsModalVisible} />
            </View>
        )
    } else {
        return <Loading />
    }
}

export default FollowersModal;