import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from "react-native"
import { loginValidations } from "../../../utils/validations";
import { useFormik } from "formik";
import { language } from "../../../utils/utils";
import { useLazyQuery } from "@apollo/client";
import { getToastMessage } from "../../../utils/Toast";
import { useAuthContext } from "../../../navigation/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../../apollo/User/userQueries";
import CustomLoading from "../../../components/CustomLoading";

const Login = () => {

  const { setUserId } = useAuthContext();
  const [loginUser, { loading }] = useLazyQuery(login);

  const { handleChange, handleSubmit, handleBlur, handleReset, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      let type;
      let text1;
      let text2;
      const result = await loginUser({
        variables: {
          data: { Email: values.email, Password: values.password }
        }
      });
      if (result) {
        if (result.data) {
          console.log(result.data)
          if (result.data.login) {
            getToastMessage({
              type: "success",
              text1: language.includes("tr") ?
                "Giriş Başarılı" :
                "Login Successfully",
              text2: language.includes("tr") ?
                "Uygulamaya başarıyla giriş yaptınız." :
                "You have successfully logged into the application."
            });
            setUserId(result.data.login._id);
            storeData(result.data.login._id);
            handleReset();
          } else {
            getToastMessage({
              type: "error",
              text1: language.includes("tr") ?
                "Giriş Hatası" :
                "Login Error.",
              text2: language.includes("tr") ?
                "Kullanıcı Bulunamadı veya Şifreniz Hatalı" :
                "User Not Found or Incorrect Password",
            });
          }
        } else {
          getToastMessage({
            type: "error",
            text1: language.includes("tr") ?
              "Giriş Hatası" :
              "Login Error.",
            text2: language.includes("tr") ?
              "Kullanıcı Bulunamadı veya Şifreniz Hatalı" :
              "User Not Found or Incorrect Password",
          });
        }
      }
    },
    validationSchema: loginValidations
  });

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("userId", value)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <SafeAreaView className="h-full justify-center items-center bg-white dark:bg-gray-700">
      <View className="w-auto h-auto flex flex-col space-y-2">

        <View className="w-72 mb-5 items-center justify-center">
          <Text className="font-bold text-2xl text-orange-500">
            {language.includes("tr") ? "Giriş Yap" : "Login"}
          </Text>
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            inputMode="email"
            className="bg-white mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="email"
            placeholder={language.includes("tr") ? "E-mail adresi" : "E-mail adress"}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            keyboardType="email-address"
            value={values.email}
          />
          {errors.email && touched.email &&
            <Text className="w-full bg-red-500 p-2 rounded text-white mb-3">
              {errors.email}
            </Text>}
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            secureTextEntry
            inputMode="text"
            className="bg-white mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="password"
            placeholder={language.includes("tr") ? "Şifre" : "Password"}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {errors.password && touched.password &&
            <Text className="w-full bg-red-500 p-2 rounded text-white">
              {errors.password}
            </Text>}
        </View>

        {loading ?
          <CustomLoading type={"pacman"} indicatorSize={36} indicatorColor={"white"} className={"w-72 mt-2 py-5 rounded-lg items-center justify-center bg-orange-400"} /> :
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-72 p-2 rounded-lg items-center justify-center bg-orange-500">
            <Text className="text-white font-bold">
              {language.includes("tr") ? "Giriş Yap" : "Login"}
            </Text>
          </TouchableOpacity>}


      </View>
    </SafeAreaView>
  )
}

export default Login