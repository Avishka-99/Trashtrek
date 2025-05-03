import { View, Text, Image, SafeAreaView, Touchable } from 'react-native'
import React from 'react'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import Button from '@avi99/aui/src/Buttons/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../../supabase/Supabase';
import { setUser, setWaste } from '../../store/UserSlice';
import { IUser, IUserState, IUserWaste } from '../../store/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import { signin } from '../../Localization/Locale';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StackParamList } from '../../Types/StackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomIconButton } from '../../components/CustomIconButton';
type Props = NativeStackScreenProps<StackParamList, 'Signin'>;
export const Signin = ({ navigation }: Props) => {
    const [email, setEmail] = React.useState<string | null>(null);
    const [password, setPassword] = React.useState<string | null>(null);
    const user: IUserState = useSelector((state: any) => state.root.userReducer);


    const i18n = new I18n(signin);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const dispatch = useDispatch();
    const navi = useNavigation();




    const login = async () => {
        if (email && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            console.log(data, 'data from supabase')
            if (error) {
                console.error('Error signing in:', error.message);
                return;
            }
            const { data: user, error: user_err } = await supabase
                .from('user')
                .select('*')
                .ilike('user_name', email.toLowerCase())
                .single();

            console.log(user, 'user data from supabase')

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

            // const user: IUser = {
            //     id: data.user?.id,
            //     email: data.user?.email,
            //     role: data.user_metadata.role,
            //     name: data.user_metadata.name,
            //     address: data.user_metadata.address,
            //     nic: data.user_metadata.nic,
            //     phone: data.user_metadata.phone,
            // }




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
                    <TextInput
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