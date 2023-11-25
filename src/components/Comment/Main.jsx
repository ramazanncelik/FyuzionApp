import { View, Text } from 'react-native';

const Main = ({ commentData }) => {
  return (
    <View className="w-full px-2">
      <Text className="w-full text-black dark:text-white">
        {commentData.Description}
      </Text>
    </View>
  );
}

export default Main;