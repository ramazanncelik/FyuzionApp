import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { language } from '../../utils/utils';
import Comment from '../Comment';

const Comments = ({ comments, postOwner }) => {

    return (
        <ScrollView className="w-full flex-1">
            {comments.length === 0 &&
                <View className="w-full p-3 bg-blue-200 rounded-lg">
                    <Text className="text-blue-700">
                        {language.includes("tr") ? "Yorum bulunamadı" : "No comments found"}
                    </Text>
                </View>
                ||
                comments.map((comment) => {
                    return (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            postOwner={postOwner} />
                    )
                })}
        </ScrollView>
    );

}

export default Comments