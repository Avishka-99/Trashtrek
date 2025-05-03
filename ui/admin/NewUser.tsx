import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import { Dropdown } from 'react-native-element-dropdown';
import { supabase } from '../../supabase/Supabase';
import Button from '@avi99/aui/src/Buttons/Button';
import Toast from 'react-native-toast-message';
import { IUserState } from '../../store/interfaces';
import { useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import { common, signin } from '../../Localization/Locale';
export const NewUser = () => {
    const [roleid, setRoleId] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [role, setRole] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [nic, setNic] = useState<string | null>(null);

    const [nameInputKey, setNameInputKey] = useState<number>(0);
    const [emailInputKey, setEmailInputKey] = useState<number>(1000);
    const [addressInputKey, setAddressInputKey] = useState<number>(2000);
    const [phoneInputKey, setPhoneInputKey] = useState<number>(3000);
    const [nicInputKey, setNicInputKey] = useState<number>(4000);
    const [roleInputKey, setRoleInputKey] = useState<number>(5000);




    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const i18n_2 = new I18n(signin);
    i18n_2.enableFallback = true;
    i18n_2.locale = user?.locale?.locale || 'en';



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




    const roles: { label: string, value: number }[] = [
        { label: i18n_2.t('Admin'), value: 1 },
        { label: i18n_2.t('Customer'), value: 2 },
        { label: i18n_2.t('Inspector'), value: 3 },
        { label: i18n_2.t('Dealer'), value: 4 },
    ];

    const signUp = async () => {
        if (email && phone) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password: phone,
            })
            if (error) {
                showToast('error', error.message);
                return;
            }
            const user = data.user;

            const { data: insertData, error: insertError } = await supabase
                .from('user')
                .insert([
                    { user_name: email, role: roleid, nick_name: name, contact_no: phone, nic: nic, uuid: user?.id, address: address },
                ])
                .select()
                .single();
            if (insertError) {
                showToast('error', insertError.message);
                return;
            }
            if (insertData) {
                showToast('success', 'User created successfully!');
                setNameInputKey(nameInputKey + 1);
                setEmailInputKey(emailInputKey + 1);
                setAddressInputKey(addressInputKey + 1);
                setPhoneInputKey(phoneInputKey + 1);
                setNicInputKey(nicInputKey + 1);
                setRoleInputKey(roleInputKey + 1);

                setEmail(null);
                setName(null);
                setAddress(null);
                setRoleId(null);
                setPhone(null);
                setNic(null);
            }
        }

    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            padding: 16,
            top: 20,
        },
        dropdown: {
            height: 50,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 8,
            top: 8,
            width: '98%',
            left: '1%'
        },
        icon: {
            marginRight: 5,
        },
        label: {
            position: 'absolute',
            backgroundColor: 'white',
            left: 22,
            top: 8,
            zIndex: 999,
            paddingHorizontal: 8,
            fontSize: 14,
        },
        placeholderStyle: {
            fontSize: 14,
            fontFamily: 'Poppins-medium',
            left: 5,
            fontWeight: '600',
        },
        selectedTextStyle: {
            fontSize: 14,
            fontFamily: 'Poppins-medium',
            left: 5,
            fontWeight: '600',
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
        },
    });

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 24, left: 4, top: 7 }}>{i18n_2.t('create_new_user')}</Text>
            <View style={{ flex: 1, top: 30 }}>
                <TextInput
                    key={nameInputKey}
                    onChange={(text: string) => setName(text)}
                    placeholder={i18n_2.t('name')}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    key={emailInputKey}
                    onChange={(text: string) => setEmail(text)}
                    placeholder={i18n_2.t('emailPlaceholder')}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    key={phoneInputKey}
                    onChange={(text: string) => setPhone(text)}
                    placeholder={i18n_2.t('contact_no')}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    key={nicInputKey}
                    onChange={(text: string) => setNic(text)}
                    placeholder={i18n_2.t('nic')}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    key={roleInputKey}

                    iconStyle={styles.iconStyle}
                    data={roles}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? i18n_2.t('role') : '...'}
                    // searchPlaceholder="Search..."
                    value={roleid}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setRoleId(item.value);
                        setIsFocus(false);
                    }}
                // renderLeftIcon={() => (
                //     <AntDesign
                //         style={styles.icon}
                //         color={isFocus ? 'blue' : 'black'}
                //         name="Safety"
                //         size={20}
                //     />
                // )}
                />
                {roleid && roleid == 2 && <TextInput
                    key={addressInputKey}
                    onChange={(text: string) => setAddress(text)}
                    placeholder={i18n_2.t('address')}
                    containerStyle={{ width: '98%', left: '1%', top: 6 }}
                ></TextInput>}
                <Button
                    mode='flat'
                    onPress={() => signUp()}
                    title={i18n_2.t('add_user')}
                    containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                    ripple={true}
                />
            </View>

        </SafeAreaView>
    )



}