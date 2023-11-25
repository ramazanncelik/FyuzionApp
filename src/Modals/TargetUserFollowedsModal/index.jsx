import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { language } from '../../utils/utils';
import { useQuery } from '@apollo/client';
import { getMyFolloweds } from '../../apollo/Connection/connectionQeries';
import Loading from '../../components/Loading';
import TargetUserFolloweds from '../../components/TargetUserFolloweds';

const TargetUserFollowedsModal = ({ targetUserId,isModalVisible, setIsModalVisible }) => {

    const [targetUserFolloweds, setMyFolloweds] = useState([]);

    const { loading, data } = useQuery(getMyFolloweds, {
        variables: { user_id: targetUserId }
    })

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {

        if (data) {
            setMyFolloweds(data.myFolloweds);
        } else {
            setMyFolloweds([]);
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
                <TargetUserFolloweds targetUserFolloweds={targetUserFolloweds} setIsModalVisible={setIsModalVisible} />
            </View>
        )
    } else {
        return <Loading />
    }
}

export default TargetUserFollowedsModal;