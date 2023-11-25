import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from "react-native"
import React, { useEffect, useState } from "react"
import IconAntD from "react-native-vector-icons/AntDesign"
import { language } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "react-native-image-picker"
import { useAuthContext } from "../../navigation/AuthProvider";
import FastImage from "react-native-fast-image";
import { useMutation } from "@apollo/client";
import IconFA5 from "react-native-vector-icons/FontAwesome5"
import { getToastMessage } from "../../utils/Toast";
import { updateUser } from "../../apollo/User/userMutations";
import CustomLoading from "../../components/CustomLoading";

const ProfileEdit = () => {

  const { isDarkMode, userId, user } = useAuthContext();
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState({});
  const [newImageUrl, setnewImageUrl] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [updateUserData, { loading }] = useMutation(updateUser);

  const getCurrentUserStates = async () => {
    await setCurrentUser({
      NickName: user.NickName,
      Password: "",
      Name: user.Name,
      Biography: user.Biography,
      Website: user.Website,
      PhoneNumber: user.PhoneNumber,
    });
    await setnewImageUrl(user.ImageUrl);
  }

  const handleSubmit = async () => {
    const result = await updateUserData({
      variables: {
        _id: userId,
        data: {
          ...currentUser,
          ImageUrl: newImageUrl !== "" ? newImageUrl : user.ImageUrl,
          Password: currentUser.Password.length > 5 && (currentUser.Password ? currentUser.Password : user.Password) || user.Password,
          NickName: currentUser.NickName === "" ? user.NickName : currentUser.NickName,
        }
      }
    });

    if (result) {
      if (result.data) {
        if (result.data.updateUser.success) {
          await profileUpdateSuccesfull();
        } else {
          if (result.data.updateUser.nickNameExist) {
            await getToastMessage({
              type: "error",
              text1: language.includes("tr") ?
                "Güncelleme Başarısız" :
                "Update Failed",
              text2: language.includes("tr") ?
                "Girmiş olduğunuz kullanıcı adı bir başka kullanıcı tarafından kullanılmakta." :
                "The username you entered is being used by another user.",
            });
          } else {
            await getToastMessage({
              type: "error",
              text1: language.includes("tr") ?
                "Güncelleme Başarısız" :
                "Update Failed",
              text2: language.includes("tr") ?
                "Profiliniz güncellenirken bir hata ile karşılaşıldı. Lütfen tekrar deneyiniz." :
                "An error was encountered while updating your profile. Please try again.",
            });
          }
        }
        setCurrentUser({ ...currentUser, Password: "" });
      }
    }
  }

  const profileUpdateSuccesfull = async () => {
    await getToastMessage({
      type: "success",
      text1: language.includes("tr") ?
        "Güncelleme Başarılı" :
        "Update Successful",
      text2: language.includes("tr") ?
        "Profiliniz Başarıyla Güncelleştirildi" :
        "Your Profile Has Been Updated Successfully",
    });
  }

  const passwordInputChange = async (value) => {
    setCurrentUser({ ...currentUser, Password: value });
    if (value.length > 5 || value.length === 0) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  useEffect(() => {
    if (user) {
      getCurrentUserStates();
    }
  }, [user]);


  const onSelectImagePress = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo", quality: 1.0, noData: true, maxWidth: 200, maxHeight: 200 }, onMediaSelect)
  };

  const onMediaSelect = media => {
    if (!media.cancelled) {
      if (media.assets != undefined) {
        getBase64(media.assets[0].uri).then((res) => {
          setnewImageUrl(res);
        });
      }
    }
  };

  const getBase64 = async (file) => {
    const data = await fetch(file);
    const blob = await data.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  if (user) {
    return (
      <SafeAreaView className="h-full flex-col bg-white dark:bg-gray-700 p-2">
        <TouchableOpacity onPress={() => navigation.goBack()}
          className="flex-row gap-3 items-center mb-2">
          <IconAntD name="arrowleft" size={24} color={isDarkMode ? "white" : "black"} />
          <Text className="text-lg text-black dark:text-white">
            {language.includes("tr") ? "Geri" : "Back"}
          </Text>
        </TouchableOpacity>

        <View className="w-full h-full flex-row items-center justify-center">
          <ScrollView className="w-full">
            <View className="w-full flex-col space-y-2 items-center justify-center p-1">

              <TouchableOpacity
                onPress={() => {
                  onSelectImagePress();
                }}
                className="w-auto justify-center">

                <FastImage
                  className="w-24 h-24 rounded-full"
                  source={{
                    uri: newImageUrl,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />

                <View
                  className="w-32 h-32 rounded-full absolute r-3 border-2 border-white dark:border-black bg-black dark:bg-white items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    position: "absolute",
                    bottom: 0,
                    right: 3,
                    borderWidth: 2,
                    borderColor: isDarkMode ? "black" : "white",
                    backgroundColor: isDarkMode ? "white" : "black",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <IconFA5 name="camera" size={18} color={isDarkMode ? "black" : "white"} />
                </View>

              </TouchableOpacity>
              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="NickName"
                placeholder={language.includes("tr") ? "Kullanıcı Adınız" : "Your Nick Name"}
                onChangeText={value => setCurrentUser({ ...currentUser, NickName: value })}
                value={currentUser.NickName}
              />

              {currentUser.NickName === "" &&
                <Text className="w-72 bg-red-500 p-2 rounded text-white">
                  {language.includes("tr") ? "Kullanıcı Adı Boş Bırakılamaz..." : "Username cannot be left empty..."}
                </Text>}

              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="Password"
                placeholder={language.includes("tr") ? "Şifre" : "Your Password"}
                onChangeText={value => passwordInputChange(value)}
                value={currentUser.Password}
              />

              {passwordError &&
                <Text className="w-72 bg-red-500 p-2 rounded text-white">
                  {language.includes("tr") ? "Şifre değişikliği için yeni şifrenin en az 6 karakterli olması gerekiyor." : "To change the password, the new password must have at least 6 characters."}
                </Text>}

              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="Name"
                placeholder={language.includes("tr") ? "Adınız" : "Your Name"}
                onChangeText={value => setCurrentUser({ ...currentUser, Name: value })}
                value={currentUser.Name}
              />

              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="Biography"
                placeholder={language.includes("tr") ? "Biyografiniz" : "Your Biography"}
                onChangeText={value => setCurrentUser({ ...currentUser, Biography: value })}
                value={currentUser.Biography}
              />

              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="Website"
                placeholder={language.includes("tr") ? "Web Siteniz" : "Your Website"}
                onChangeText={value => setCurrentUser({ ...currentUser, Website: value })}
                value={currentUser.Website}
              />

              <TextInput
                className="w-72 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                name="PhoneNumber"
                placeholder={language.includes("tr") ? "Telefon Numaranız" : "Your Phone Number"}
                onChangeText={value => setCurrentUser({ ...currentUser, PhoneNumber: value })}
                value={currentUser.PhoneNumber}
              />

              {loading ?
                <CustomLoading type={"pacman"} indicatorSize={36} indicatorColor={"white"} className={"w-72 h-max mt-2 rounded-lg items-center justify-center bg-orange-400"} /> :
                <TouchableOpacity
                  disabled={currentUser.NickName === ""}
                  onPress={handleSubmit}
                  className="w-72 p-2 rounded-lg items-center justify-center bg-orange-500">
                  <Text className="text-white font-bold">
                    {language.includes("tr") ? "Güncelle" : "Update"}
                  </Text>
                </TouchableOpacity>}

            </View>
          </ScrollView>
        </View>

      </SafeAreaView>
    )
  }
}

export default ProfileEdit