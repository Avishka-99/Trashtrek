import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button } from '@avi99/aui';
import { supabase } from '../../supabase/Supabase';
import { useDispatch, useSelector } from 'react-redux';
import { ILocale, IUserState } from '../../store/interfaces';
import Toast from 'react-native-toast-message';
import { I18n } from 'i18n-js';
import { common } from '../../Localization/Locale';
import { setLocale, setUser } from '../../store/UserSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const Settings = () => {
    const [password, setPassword] = useState<string>('');
    const [inputKey, setInputKey] = useState<number>(0);
    const dispatch = useDispatch();
    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';


    const changePassword = async () => {
        if (password.length > 0) {
            const { data, error } = await supabase.auth.updateUser({
                password: password,
            })
            if (error) {
                showToast('error', error.message)
                return;
            }
            setInputKey(inputKey + 1);
            showToast('success', 'Password changed successfully!')
        }
    };

    const showToast = (type: string, message: string) => {
        Toast.show({
            type: type,
            text1: type === 'success' ? 'Done' : 'Ooops!',
            text2: message,
            position: 'top',
            visibilityTime: 2000,
            autoHide: true,
        });
    }
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast('error', error.message)
            return;
        }
        dispatch(setUser(null));
    }
    const changeLanguage = async () => {
        const localeList: string[] = ['en', 'ta', 'si']
        const currentLocale: string = user?.locale?.locale || 'en';
        const currentIndex: number = localeList.indexOf(currentLocale);
        const nextLocale: string = localeList[(currentIndex + 1) % 3];
        AsyncStorage.setItem('locale', nextLocale);
        const locale: ILocale = {
            locale: nextLocale,
        }
        dispatch(setLocale(locale));

    }
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ height: 80, width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 27, left: 5 }}>{i18n.t('change_password')}</Text>
                <Button
                    mode='flat'
                    onPress={() => logout()}
                    title={i18n.t('log_out')}
                    containerStyle={{ width: '20%', marginTop: 20, left: '-1%', backgroundColor: '#F75A5A', borderColor: '#F75A5A' }}
                    ripple={true}
                />
            </View>
            <View>
                <TextInput
                    value={password}
                    key={inputKey}
                    onChange={(text: string) => setPassword(text)}
                    placeholder={i18n.t('new_password')}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <Button
                    mode='flat'
                    onPress={() => changePassword()}
                    title={i18n.t('confirm')}
                    containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                    ripple={true}
                />
            </View>
            <Button
                mode='flat'
                onPress={() => changeLanguage()}
                title={i18n.t('change_language')}
                containerStyle={{ width: '98%', marginTop: 20, left: '1%', backgroundColor: '#67AE6E', borderColor: '#67AE6E' }}
                ripple={true}
            />



        </SafeAreaView>
    )
}