import { object, string, ref } from 'yup';
import { language } from './utils';


export const signUpValidations = object({
    email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
    nickName: string()
        .trim()
        .required(language.includes("tr") ?
            'Kullanıcı Adı Boş Geçilemez!'
            :
            'Nick Name Cannot be blank!')
        .matches(/^[^\s]*$/, language.includes("tr") ?
            "Kullanıcı adı boşluk içeremez" :
            "Username cannot contain spaces")
        .max(30, language.includes("tr") ?
            "Kullanıcı adı en fazla 30 karakter olabilir"
            :
            "Username can be up to 30 characters"),
    password: string()
        .required(language.includes("tr") ?
            'Şifre Boş Geçilemez!'
            :
            'Password Cannot be blank!')
        .min(6, ({ min }) => language.includes("tr") ?
            'Şifre en az ' + min + ' karakterden oluşmalıdır!'
            :
            'Password must be at least' + min + 'characters!'),
    passwordConfirm: string()
        .oneOf([ref("password")], language.includes("tr") ?
            "Şifreler aynı olmalıdır!"
            : "Passwords must match!")
        .required(language.includes("tr") ?
            'Boş Geçilemez!'
            :
            'Cannot be blank!'),
});

export const loginValidations = object({
    email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
    password: string()
        .required(language.includes("tr") ?
            'Şifre Boş Geçilemez!'
            :
            'Password Cannot be blank!')
        .min(1, ({ min }) => language.includes("tr") ?
            'Şifre en az ' + min + ' karakterden oluşmalıdır!'
            :
            'Password must be at least' + min + 'characters!'),
});

export const createResetPaswordMailValidations = object({
    email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
});

export const newPostValidations = object({
    Description: string()
        .required(language.includes("tr") ?
            'Açıklama Boş Geçilemez!'
            :
            'Description Cannot be blank!')
        .max(1000, language.includes("tr") ?
            "Açıklama en fazla 1000 karakter olabilir"
            :
            "Description can be up to 1000 characters")
});

export const newComplaintValidations = object({
    Title: string()
        .required(language.includes("tr") ?
            'Başlık Boş Geçilemez!'
            :
            'Title Cannot be blank!')
        .min(2, () => language.includes("tr") ? "Lütfen Bir Başlık Seçiniz..." : "Please Select a Title..."),
    Description: string()
        .required(language.includes("tr") ?
            'Açıklama Boş Geçilemez!'
            :
            'Description Cannot be blank!')
        .max(2500, language.includes("tr") ?
            "Açıklama en fazla 1000 karakter olabilir"
            :
            "Description can be up to 1000 characters"),
});