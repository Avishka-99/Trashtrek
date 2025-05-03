import { View, Text, SafeAreaView } from 'react-native'
import React, { useRef, useState } from 'react'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import Button from '@avi99/aui/src/Buttons/Button';
import Seperator from '@avi99/aui/src/Seperator/Seperator';
import { supabase } from '../../supabase/Supabase';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useSelector } from 'react-redux';
import { IUserState } from '../../store/interfaces';
import Toast from 'react-native-toast-message';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { I18n } from 'i18n-js';
import { common } from '../../Localization/Locale';
export const Settings = () => {
    const [password, setPassword] = useState<string>('');
    const [inputKey, setInputKey] = useState<number>(0);

    const ref = useRef<ViewShot>(null);

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

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ height: 80, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 27, left: 5 }}>{i18n.t('change_password')}</Text>
            </View>
            <View>
                <TextInput
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



        </SafeAreaView>
    )
}