import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image';
import Accept from './Actions/Accept';
import Reject from './Actions/Reject';
import { language } from '../../../utils/utils';
import { useNavigation } from '@react-navigation/native';

const ConnectionNotification = ({ notificationData }) => {

  const navigation = useNavigation();

  return (
    <View className="w-[100%] flex flex-row space-x-2 mb-4 items-center">
      <TouchableOpacity onPress={() => navigation.navigate("TargetUser", {
        targetUserId: notificationData.fromUser._id
      })} className="flex-1 flex-row space-x-2 items-center">
        <FastImage
          className="w-12 h-12 rounded-full"
          source={{
            uri: notificationData.fromUser.ImageUrl,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text className="flex-1 text-sm text-black dark:text-white">
          {language.includes("tr") ?
            <>
              <Text style={{ fontWeight: 'bold' }}>
                {notificationData.fromUser.NickName.replace(/(.+)/g, '$1')}
              </Text>
              {`  kullanıcısı seni takip etmek istiyor`}
            </>
            :
            <>
              {`User  `}
              <Text style={{ fontWeight: 'bold' }}>
                {notificationData.fromUser.NickName.replace(/(.+)/g, '$1')}
              </Text>
              {`  wants to follow you.`}
            </>}
        </Text>
      </TouchableOpacity>

      <View className="w-auto h-auto flex flex-col">
        <Accept notificationData={notificationData} />
        <Reject notificationData={notificationData} />
      </View>
    </View>
  )
}

export default ConnectionNotification;