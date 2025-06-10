import { View, Text, Image, SafeAreaView, Touchable } from 'react-native'
import React from 'react'
import { TextInput, Button } from '@avi99/aui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../../supabase/Supabase';
import { setPenalty, setUser, setWaste } from '../../store/UserSlice';
import { IUser, IUserState, IUserWaste } from '../../store/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import { signin } from '../../Localization/Locale';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StackParamList } from '../../Types/StackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
type Props = NativeStackScreenProps<StackParamList, 'Signin'>;
export const Signin = ({ navigation }: Props) => {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const user: IUserState = useSelector((state: any) => state.root.userReducer);


    const i18n = new I18n(signin);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const dispatch = useDispatch();
    const navi = useNavigation();

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


    const login = async () => {
        if (email && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                showToast('error', error.message);
                return;
            }
            const { data: user, error: user_err } = await supabase
                .from('user')
                .select('*')
                .ilike('user_name', email.toLowerCase())
                .single();

            if (user) {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const startDate = new Date(year, month, 1).toISOString();
                const endDate = new Date(year, month + 1, 1).toISOString();



                const { data: wasteData, error } = await supabase
                    .from('waste_collection')
                    .select('*')
                    .eq('user_id', user.id)
                    .gt('created_at', startDate)
                    .lte('created_at', endDate)
                    .single();

                const user_data: IUser = {
                    id: user?.id,
                    email: user?.user_name,
                    role: user?.role,
                    name: user?.nick_name,
                    address: user?.address,
                    phone: user?.contact_no,
                    current_month: startDate
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
                    dispatch(setPenalty(wasteData?.penalty));
                    dispatch(setWaste(waste));
                } else {
                    if (user?.role === 2) {
                        const { data, error } = await supabase
                            .from('waste_collection')
                            .insert([
                                { blue: 0, red: 0, green: 0, penalty: 0, user_id: user?.id }
                            ]);


                        const { data: wasteData_2, error: err_2 } = await supabase
                            .from('waste_collection')
                            .select('*')
                            .eq('user_id', user.id)
                            .gt('created_at', startDate)
                            .lte('created_at', endDate)
                            .single();
                        if (wasteData_2) {
                            const waste_2: IUserWaste[] = [];
                            const waste_data_blue: IUserWaste = {
                                type: 1,
                                category: 'Blue',
                                amount: wasteData_2?.blue,
                            }
                            const waste_data_red: IUserWaste = {
                                type: 2,
                                category: 'Red',
                                amount: wasteData_2?.red,
                            }
                            const waste_data_green: IUserWaste = {
                                type: 3,
                                category: 'Green',
                                amount: wasteData_2?.green,
                            }
                            waste_2.push(waste_data_blue, waste_data_red, waste_data_green);

                            dispatch(setWaste(waste_2));
                            dispatch(setPenalty(wasteData_2?.penalty));
                        }

                    }
                    if (user?.role === 4) {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = now.getMonth();
                        const startDate = new Date(year, month, 1).toISOString();
                        const endDate = new Date(year, month + 1, 1).toISOString();
                        const { data: wasteData_2, error: err_2 } = await supabase
                            .from('waste_collection')
                            .select('*')
                            .gt('created_at', startDate)
                            .lte('created_at', endDate);
                        if (wasteData_2) {
                            let totalBlue: number = 0;
                            let totalRed: number = 0;
                            let totalGreen: number = 0;
                            wasteData_2.forEach((item) => {
                                totalBlue += item.blue;
                                totalRed += item.red;
                                totalGreen += item.green;
                            })
                            const waste_2: IUserWaste[] = [];
                            const waste_data_blue: IUserWaste = {
                                type: 1,
                                category: 'Blue',
                                amount: totalBlue,
                            }
                            const waste_data_red: IUserWaste = {
                                type: 2,
                                category: 'Red',
                                amount: totalRed,
                            }
                            const waste_data_green: IUserWaste = {
                                type: 3,
                                category: 'Green',
                                amount: totalGreen,
                            }
                            waste_2.push(waste_data_blue, waste_data_red, waste_data_green);
                            dispatch(setWaste(waste_2));
                        }
                    }
                }


            }

        } else {
            showToast('success', 'Please enter email and password');
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
                        value={email}
                        placeholder={i18n.t('emailPlaceholder')}
                        containerStyle={{ width: '98%', left: '1%' }}
                    ></TextInput>
                    <TextInput
                        value={password}
                        onChange={(text: string) => setPassword(text)}
                        placeholder={i18n.t('passwordPlaceholder')}
                        secured
                        containerStyle={{ width: '98%', left: '1%' }}
                    ></TextInput>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('SigninOtp')}>
                        <Text style={{ left: '1%', color: 'dodgerblue', fontFamily: 'Poppins-light', textDecorationLine: 'underline', }}>{i18n.t('forgotpassword')}</Text>
                    </TouchableWithoutFeedback>

                    <Button
                        mode='flat'
                        onPress={() => login()}
                        title={i18n.t('signin')}
                        containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                        ripple={true}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
        //"@avi99/aui": "^0.1.5",

    )
}