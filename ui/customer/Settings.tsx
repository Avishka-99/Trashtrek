import { View, Text, SafeAreaView } from 'react-native'
import React, { useRef, useState } from 'react'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import Button from '@avi99/aui/src/Buttons/Button';
import Seperator from '@avi99/aui/src/Seperator/Seperator';
import { supabase } from '../../supabase/Supabase';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useSelector } from 'react-redux';
import { ILocale, IUserState } from '../../store/interfaces';
import Toast from 'react-native-toast-message';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { I18n } from 'i18n-js';
import { common } from '../../Localization/Locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocale } from '../../store/UserSlice';
import { useDispatch } from 'react-redux';
export const Settings = () => {
    const [password, setPassword] = useState<string>('');
    const [inputKey, setInputKey] = useState<number>(0);

    const ref = useRef<ViewShot>(null);

    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const dispatch = useDispatch();



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
            showToast('error', 'Password changed successfully!')
        }
    };

    const saveBarcode = async () => {
        if (ref.current) {
            if (ref.current?.capture) {
                const uri = await ref.current.capture();
                const asset = await MediaLibrary.createAssetAsync(uri);
                await MediaLibrary.createAlbumAsync('Barcode', asset, false);

                showToast('success', 'Barcode saved to camera roll!')
                // CameraRoll.save(uri, { type: 'photo' })
                //     .then(() => console.log('Image saved to camera roll!'))
            }
        }
    }

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
            <Seperator containerStyle={{ top: 20, width: '98%', left: '1%' }} />
            <View style={{ height: 80, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 27, left: 5, top: 10 }}>{i18n.t('my_barcode')}</Text>
            </View>
            <ViewShot ref={ref} options={{ fileName: "my_barcode", format: "jpg", quality: 0.9 }}>
                {/* <View style={{ height: 200, width: '100%' }}> */}
                {user && user.user && user.user.address && <Barcode value={user.user.id.toString()} format='CODE39' />}


                {/* </View> */}
            </ViewShot>
            <Button
                mode='flat'
                onPress={() => saveBarcode()}
                title={i18n.t('save_barcode')}
                containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                ripple={true}
            />
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