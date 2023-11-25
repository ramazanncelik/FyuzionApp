import React, { useState, createContext, useContext, useEffect, useMemo } from 'react'
import { NativeModules, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    const theme = useColorScheme() === 'dark';
    const moduleLanguage = NativeModules.I18nManager.localeIdentifier;
    const { user } = useSelector(state => state.auth);
    const { myPosts } = useSelector(state => state.myPosts);
    const [userId, setUserId] = useState(null);
    const [language, setLanguage] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(null);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem("userId");
            if (value !== null) {
                setUserId(value);
            } else {
                setUserId(null);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const data = useMemo(
        () => ({
            userId,
            setUserId,
            user,
            myPosts,
            isDarkMode,
            language
        }),
        [userId, user, myPosts, isDarkMode, language]
    );

    useEffect(() => {
        getData();
        setLanguage(moduleLanguage)
        setIsDarkMode(theme);
    }, [AsyncStorage.getItem("userId"), theme, moduleLanguage]);

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => {
    const context = useContext(AuthContext);
    return context;
}

export { AuthContext, AuthProvider, useAuthContext };
