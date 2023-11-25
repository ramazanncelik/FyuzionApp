import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import React from "react"
import usageagreement from "../../utils/usageagreement"
import { language } from "../../utils/utils"

const UsageAgreementModal = ({ setModalVisible }) => {
  return (
    <View className="h-auto p-1 bg-white dark:bg-gray-700 rounded-lg">
      <ScrollView className="w-full h-[80%] p-2">
        {usageagreement.map((item) => {
          return (
            <View key={item.id} className="flex flex-row">
              <Text className="w-[8%] font-bold text-black dark:text-white">
                {item.id}.
              </Text>

              <Text className="w-[92%] text-black dark:text-white mb-2">
                {language.includes("tr") ? item.tr : item.en}
              </Text>
            </View>
          )
        })}
      </ScrollView>

      <View className="w-full flex-row items-center justify-center mt-2">
        <TouchableOpacity className="w-[75%] p-2 bg-blue-500 items-center rounded-lg" onPress={() => setModalVisible(false)}>
          <Text className="text-white font-bold">
            {language.includes("tr") ? "Kapat" : "Close"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UsageAgreementModal