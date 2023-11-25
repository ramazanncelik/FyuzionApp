import { View, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getConnection, getFollowers } from '../../../apollo/Connection/connectionQeries';
import { useAuthContext } from '../../../navigation/AuthProvider';
import { useMutation, useQuery } from '@apollo/client';
import { language } from '../../../utils/utils';
import { BallIndicator } from 'react-native-indicators'
import { removeConnection } from '../../../apollo/Connection/connectionMutation';
import { getCurrentUser } from '../../../apollo/User/userQueries';

const Remove = ({ followerId }) => {

  const { isDarkMode, userId } = useAuthContext();
  const [connectionId, setConnectionId] = useState(null)

  const { loading: getConnection_loading, data: getConnection_data, refetch: getConnection_refetch } = useQuery(getConnection, {
    variables: {
      data: {
        From: followerId,
        To: userId
      }
    }
  });

  const [deleteConnection, { loading: removeConnection_loading }] = useMutation(removeConnection, {
    refetchQueries: [
      { query: getFollowers, variables: { user_id: userId } },
      {
        query: getConnection, variables: {
          data: {
            From: followerId,
            To: userId,
          }
        }
      },
      {
        query: getCurrentUser, variables: {
          _id: userId
        }
      },
    ]
  });

  const handleSubmit = async () => {
    await deleteConnection({
      variables: {
        connection_id: connectionId
      }
    });
  }

  useEffect(() => {
    if (getConnection_data) {
      if (getConnection_data.connection) {
        setConnectionId(getConnection_data.connection._id)
      } else {
        setConnectionId(null)
      }
    }
  }, [getConnection_data]);

  useEffect(() => {
    getConnection_refetch({
      data: {
        From: followerId,
        To: userId
      }
    });
  }, [getConnection_refetch]);

  if (!getConnection_loading && !removeConnection_loading) {
    return (
      <TouchableOpacity onPress={() => handleSubmit()} className="w-full p-2 bg-gray-300 rounded-lg items-center justify-center">
        <Text className="text-sm text-black">
          {language.includes("tr") ? "Kaldır" : "Remove"}
        </Text>
      </TouchableOpacity>
    )
  } else {
    return (
      <View className="w-full p-2 border border-gray-300 rounded-lg items-center justify-center">
        <BallIndicator size={20} color={isDarkMode ? "white" : "black"} />
      </View>
    )
  }
}

export default Remove