import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from "react-native"
import { createResetPaswordMailValidations } from "../../../utils/validations";
import { useFormik } from "formik";
import { language } from "../../../utils/utils";
import { useMutation } from "@apollo/client";
import { getToastMessage } from "../../../utils/Toast";
import { createResetPasswordMail } from "../../../apollo/User/userMutations";
import CustomLoading from "../../../components/CustomLoading";

const ResetPassword = () => {

  const [createMail, { loading }] = useMutation(createResetPasswordMail);

  const { handleChange, handleSubmit, handleBlur, handleReset, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const result = await createMail({
        variables: {
          data: {
            to: values.email,
            subject: language.includes("tr") ? "Şifre Sıfırlama - Fyuzion" : "Password Reset - Fyuzion",
            text: language.includes("tr") ? "Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayabilirsiniz" : "You can click on the following link to reset your password",
          }
        }
      });
      if (result) {
        if (result.data) {
          if (result.data.createResetPasswordMail) {
            getToastMessage({
              type: "success",
              text1: language.includes("tr") ?
                "Mail Gönderimi Başarılı" :
                "Email Send Successful",
              text2: language.includes("tr") ?
                "Mail başarıyla gönderildi. Lütfen mail adresinizi kontrol ediniz." :
                "Email sent successfully. Please check your e-mail address."
            });
            handleReset();
          } else {
            getToastMessage({
              type: "error",
              text1: language.includes("tr") ?
                "Mail Gönderimi Başarısız" :
                "Mail Send Failed",
              text2: language.includes("tr") ?
                "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
                "Email sending failed. Please try again.",
            });
          }
        } else {
          getToastMessage({
            type: "error",
            text1: language.includes("tr") ?
              "Mail Gönderimi Başarısız" :
              "Mail Send Failed",
            text2: language.includes("tr") ?
              "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
              "Email sending failed. Please try again.",
          });
        }
      }
    },
    validationSchema: createResetPaswordMailValidations
  });

  return (
    <SafeAreaView className="h-full justify-center items-center bg-white dark:bg-gray-700">
      <View className="w-auto h-auto flex flex-col space-y-2">

        <View className="w-72 mb-5 items-center justify-center">
          <Text className="font-bold text-2xl text-orange-500">
            {language.includes("tr") ? "Şifre Sıfırla" : "Reset Password"}
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

        {loading ?
          <CustomLoading type={"pacman"} indicatorSize={36} indicatorColor={"white"} className={"w-72 mt-2 py-5 rounded-lg items-center justify-center bg-orange-400"} /> :
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-72 p-2 rounded-lg items-center justify-center bg-orange-500">
            <Text className="text-white font-bold">
              {language.includes("tr") ? "Şifre Sıfırla" : "Reset Password"}
            </Text>
          </TouchableOpacity>}

      </View>
    </SafeAreaView>
  )
}

export default ResetPassword;