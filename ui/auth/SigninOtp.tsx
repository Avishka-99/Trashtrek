import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import Button from '@avi99/aui/src/Buttons/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../../supabase/Supabase';
import { setUser, setWaste } from '../../store/UserSlice';
import { IUser, IUserState, IUserWaste } from '../../store/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import {  signin } from '../../Localization/Locale';
import OtpInput from '@avi99/aui/src/OtpInput/OtpInput';
import Toast from 'react-native-toast-message';
export const SigninOtp = () => {
    const [email, setEmail] = React.useState<string | null>(null);
    const [isOtpSent, setIsOtpSent] = React.useState<boolean>(false);
    const [otp, setOtp] = React.useState<string | null>(null);

    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const i18n = new I18n(signin);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const dispatch = useDispatch();

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
    const sendOtp = async () => {
        if (email) {
            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: false
                }
            });
            if (error) {
                showToast('error', error.message);
                return;
            }
            showToast('success', 'OTP sent to your email');
            setIsOtpSent(true);
        }
    }

    const onCompleteOtp = (otp: string) => {
        setOtp(otp);

    }

    const verifyotp = async () => {
        if (email && otp) {
            const { data, error } = await supabase.auth.verifyOtp({
                email: email,
                token: otp,
                type: 'email',
            });
            if (error) {
                showToast('error', error.message);
                return;
            }
            const { data: user, error: user_err } = await supabase
                .from('user')
                .select('*')
                .eq('user_name', data.user?.email)
                .single();

            if (user) {
                const { data: wasteData, error } = await supabase
                    .from('waste_collection')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();


                const user_data: IUser = {
                    id: user?.id,
                    email: user?.user_name,
                    role: user?.role,
                    name: user?.nick_name,
                    address: user?.address,
                    phone: user?.contact_no,
                    current_month: wasteData?.created_at
                }

                dispatch(setUser(user_data));
                if (wasteData) {
                    const waste: IUserWaste[] = [];
                    const waste_data_blue: IUserWaste = {
                        type: 1,
                        category: 'Blue',
                        amount: wasteData?.blue,
                    }
                    const waste_data_red: IUserWaste = {
                        type: 2,
                        category: 'Red',
                        amount: wasteData?.red,
                    }
                    const waste_data_green: IUserWaste = {
                        type: 3,
                        category: 'Green',
                        amount: wasteData?.green,
                    }
                    waste.push(waste_data_blue, waste_data_red, waste_data_green);

                    dispatch(setWaste(waste));
                }


            }
        }
    }


    return (
        <SafeAreaView style={{ height: '100%', width: '100%' }}>
            <KeyboardAwareScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <View style={{ width: '100%', flex: 4 / 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{
                        fontFamily: 'SourGummy-italic',
                        fontSize: 50,
                        color: '#7EB693',
                        width: '60%',

                    }}>TrashTrek</Text>
                    <Image
                        source={require('../../assets/signin.png')}
                        style={{ width: '100%', height: 200 }}
                        resizeMode='contain' />
                </View>

                <View style={{ width: '100%', flex: 3 / 10 }}>
                    <TextInput
                        onChange={(text: string) => setEmail(text)}
                        placeholder={i18n.t('emailPlaceholder')}
                        containerStyle={{ width: '98%', left: '1%' }}
                    ></TextInput>
                    {isOtpSent && <OtpInput length={6} onChange={() => { }} onComplete={(text: string) => onCompleteOtp(text)} containerStyle={{ width: '98%', left: '1%' }} />}
                    <Button
                        mode='flat'
                        onPress={!isOtpSent ? () => sendOtp() : () => verifyotp()}
                        title={isOtpSent ? i18n.t('verifyotp') : i18n.t('sendotp')}
                        containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                        ripple={true}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}