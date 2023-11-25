import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useKeenSliderNative } from 'keen-slider/react-native'
import Pinchable from 'react-native-pinchable';
import VideoPlayer from 'react-native-video-player'

const Files = ({ postData }) => {

    const slides = postData.Files.length
    const slider = useKeenSliderNative({
        mode: "free-snap",
        slides: postData.Files.length !== 1 &&
        {
            number: slides,
            perView: 1.1,
            spacing: 10,
        }
            ||
        {
            number: slides,
            origin: "center",
            perView: 1,
            spacing: 10,
        },
    });

    return (
        <View className={`w-full h-auto flex flex-col space-y-2 mb-2 ${postData.Files.length !== 1 && "px-12"}`}>

            <View className="w-full h-96" {...slider.containerProps}>
                {[...Array(slides).keys()].map(key => {
                    if (postData.Files[key].FileType.includes("image")) {
                        return (
                            <Pinchable
                                key={key}
                                {...slider.slidesProps[key]}>
                                <FastImage
                                    className="w-full h-96 rounded-lg"
                                    source={{
                                        uri: postData.Files[key].FileUrl,
                                        priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </Pinchable>
                        )
                    } else {
                        return (
                            <VideoPlayer key={key}
                                {...slider.slidesProps[key]}
                                className="w-full h-96 rounded-lg"
                                video={{ uri: postData.Files[key].FileUrl }}
                                thumbnail={{ uri: postData.Files[key].FileUrl }}
                                showDuration
                            />
                        )
                    }
                })}
            </View>
        </View>
    );
}
export default Files;