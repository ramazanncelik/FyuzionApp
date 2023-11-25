import { View, Text } from 'react-native'
import Copy from './Actions/Copy';
import Delete from './Actions/Delete';
import { useAuthContext } from '../../../../navigation/AuthProvider';
import Edit from './Actions/Edit';

const MyMessageMenu = ({ message, setIsMenuVisible }) => {

    const { language } = useAuthContext();

    return (
        <View className="w-full flex flex-row items-center justify-end my-1">

            <View className="w-[75%] flex flex-col space-y-1 px-2 py-1 bg-gray-100 dark:bg-slate-600 border border-green-500 rounded-lg">

                <View className="w-full flex flex-row items-center justify-end">
                    <Text onPress={() => setIsMenuVisible(false)} className="font-bold text-sm">
                        {language.includes("tr") ? "Kapat" : "Close"} X
                    </Text>
                </View>

                {message.Type === "text" &&
                    <View className="w-full py-3 flex flex-col space-y-2 items-center justify-center">
                        <Delete message={message} setIsMenuVisible={setIsMenuVisible} />
                        <View className="flex flex-1 flex-row">
                            <Copy message={message} setIsMenuVisible={setIsMenuVisible} />
                            <Edit message={message} setIsMenuVisible={setIsMenuVisible} />
                        </View>
                    </View>
                    ||
                    <View className="w-full py-3 flex flex-row items-center justify-center">
                        <Copy message={message} setIsMenuVisible={setIsMenuVisible} />
                        <Delete message={message} setIsMenuVisible={setIsMenuVisible} />
                    </View>}

            </View>

        </View>
    )
}

export default MyMessageMenu;