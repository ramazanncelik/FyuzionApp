import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from "react-native"
import React, { useState } from "react"
import { signUpValidations } from "../../../utils/validations";
import { useFormik } from "formik";
import { defaultImage, language } from "../../../utils/utils";
import { useMutation } from "@apollo/client";
import { addUser, createEmailVerifyMail } from "../../../apollo/User/userMutations";
import { getToastMessage } from "../../../utils/Toast";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Modal from "react-native-modal"
import UsageAgreementModal from "../../../Modals/UsageAgreementModal"
import CustomLoading from "../../../components/CustomLoading";

const SignUp = () => {

  const [createUser, { createUser_loading }] = useMutation(addUser);
  const [createMail] = useMutation(createEmailVerifyMail);
  const [usageAgreement, setUsageAgreement] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);

  const { handleChange, handleSubmit, handleBlur, handleReset, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
      nickName: "",
      password: "",
      passwordConfirm: "",
    },
    onSubmit: async (values) => {
      let type;
      let text1;
      let text2;
      if (usageAgreement) {
        const result = await createUser({
          variables: {
            data: {
              Email: values.email,
              NickName: values.nickName,
              Password: values.password,
              ImageUrl: defaultImage,
              Name: "",
              Biography: "",
              Website: "",
              PhoneNumber: "",
              Follower: 0,
              MyFollowed: 0,
              ConfirmationCode: (Math.floor(Math.random() * 90000) + 10000).toString(),
              Role: "User",
              EmailVerify: false,
              OnlineStatus: false,
              UsageAgreement: usageAgreement,
              IsPrivate: false
            }
          }
        });

        if (result) {
          if (result.data) {
            if (result.data.createUser.success) {
              type = "success";
              text1 = language.includes("tr") ?
                "Üyelik Oluşturuldu." :
                "Membership Created.";
              text2 = language.includes("tr") ?
                "Lütfen mail adresinizi kontrol ediniz." :
                "Please check your e-mail address.";
              await getEmailVerifyMail();
              handleReset();
            } else {
              if (result.data.createUser.nickNameExist) {
                type = "error";
                text1 = language.includes("tr") ?
                  "Üyelik Hatası" :
                  "Membership Error.";
                text2 = language.includes("tr") ?
                  "Girdiğiniz Kullanıcı Adı kullanımda." :
                  "The Username you entered is in use.";
              } else {
                type = "error";
                text1 = language.includes("tr") ?
                  "Üyelik Hatası" :
                  "Membership Error.";
                text2 = language.includes("tr") ?
                  "Girdiğiniz E-posta adresi kullanımda." :
                  "The Email address you entered is in use.";
              }
            }
          }
        }
      } else {
        type = "error";
        text1 = language.includes("tr") ?
          "Sözleşme Hatası" :
          "Contract Error.";
        text2 = language.includes("tr") ?
          "Lütfen Kullanım Koşullarını Onaylayınız!" :
          "Please Confirm the Terms of Use!";
      }
      await getToastMessage({
        type: type,
        text1: text1,
        text2: text2,
      });
    },
    validationSchema: signUpValidations
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getEmailVerifyMail = async () => {
    const result = await createMail({
      variables: {
        data: {
          to: values.email,
          subject: language.includes("tr") ? "E-posta Onaylama - Fyuzion" : "Email Verify - Fyuzion",
          text: language.includes("tr") ? "E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayabilirsiniz" : "You can click on the link below to verify your email address",
        }
      }
    });
    if (result) {
      if (result.data) {
        if (result.data.createEmailVerifyMail) {
          getToastMessage({
            type: "success",
            text1: language.includes("tr") ?
              "Mail Gönderimi Başarılı" :
              "Email Send Successful",
            text2: language.includes("tr") ?
              "Mail başarıyla gönderildi. Lütfen mail adresinizi kontrol ediniz." :
              "Email sent successfully. Please check your e-mail address."
          });
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
  }

  return (
    <SafeAreaView className="h-full justify-center items-center bg-white dark:bg-gray-700">
      <View className="w-auto h-auto flex flex-col space-y-2">

        <View className="w-72 mb-5 items-center justify-center">
          <Text className="font-bold text-2xl text-orange-500">
            {language.includes("tr") ? "Kayıt Ol" : "Sign In"}
          </Text>
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="email"
            placeholder={language.includes("tr") ? "E-mail adresi" : "E-mail adress"}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            keyboardType="email-address"
            value={values.email}
          />
          {errors.email && touched.email &&
            <Text className="w-full bg-red-500 p-2 rounded text-white">
              {errors.email}
            </Text>}
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="nickName"
            placeholder={language.includes("tr") ? "Kullanıcı Adı" : "Nick Name"}
            onChangeText={handleChange("nickName")}
            onBlur={handleBlur("nickName")}
            keyboardType="email-address"
            value={values.nickName}
          />
          {errors.nickName && touched.nickName &&
            <Text className="w-full bg-red-500 p-2 rounded text-white">
              {errors.nickName}
            </Text>}
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            secureTextEntry
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="password"
            placeholder={language.includes("tr") ? "Şifre" : "Password"}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            keyboardType="email-address"
            value={values.password}
          />
          {errors.password && touched.password &&
            <Text className="w-full bg-red-500 p-2 rounded text-white">
              {errors.password}
            </Text>}
        </View>

        <View className="w-72 flex flex-col space-y-2">
          <TextInput
            secureTextEntry
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            name="passwordConfirm"
            placeholder={language.includes("tr") ? "Şifre Onayla" : "Password Confirm"}
            onChangeText={handleChange("passwordConfirm")}
            onBlur={handleBlur("passwordConfirm")}
            keyboardType="email-address"
            value={values.passwordConfirm}
          />
          {errors.passwordConfirm && touched.passwordConfirm &&
            <Text className="w-full bg-red-500 p-2 rounded text-white">
              {errors.passwordConfirm}
            </Text>}
        </View>

        <View className="w-72 flex flex-row">
          <BouncyCheckbox
            name="usageAgreement"
            size={25}
            fillColor="#22c55e"
            isChecked={usageAgreement}
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: "#22c55e" }}
            textStyle={{
              textDecorationLine: "none",
            }}
            onPress={(isChecked) => setUsageAgreement(isChecked)}
          />
          {language.includes("tr") ?
            <View className="flex flex-row space-x-2 items-center justify-center">
              <TouchableOpacity onPress={() => toggleModal()}>
                <Text className="text-blue-500 font-bold underline">
                  Kullanım Şartlarını
                </Text>
              </TouchableOpacity>
              <Text className="text-black dark:text-white">
                onaylıyorum.
              </Text>
            </View> :
            <View className="flex flex-row space-x-2 items-center justify-center">
              <Text className="text-black dark:text-white">
                I accept the
              </Text>
              <TouchableOpacity onPress={() => toggleModal()}>
                <Text className="text-blue-500 font-bold underline">
                  Terms of Use
                </Text>
              </TouchableOpacity>
            </View>}
        </View>

        <Modal isVisible={isModalVisible}>
          <UsageAgreementModal setModalVisible={setModalVisible} />
        </Modal>

        {createUser_loading ?
          <CustomLoading type={"pacman"} indicatorSize={36} indicatorColor={"white"} className={"w-72 mt-2 py-5 rounded-lg items-center justify-center bg-orange-400"} />
          :
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-72 p-2 rounded-lg items-center justify-center bg-orange-500">
            <Text className="text-white font-bold">
              {language.includes("tr") ? "Kayıt Ol" : "Sign In"}
            </Text>
          </TouchableOpacity>}

      </View>
    </SafeAreaView>
  )
}

export default SignUp