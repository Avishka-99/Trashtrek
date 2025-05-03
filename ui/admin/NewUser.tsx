import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import { Dropdown } from 'react-native-element-dropdown';
import { supabase } from '../../supabase/Supabase';
import Button from '@avi99/aui/src/Buttons/Button';
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



    const roles: { label: string, value: number }[] = [
        { label: 'Admin', value: 1 },
        { label: 'Customer', value: 2 },
        { label: 'Inspector', value: 3 },
        { label: 'Dealer', value: 4 },
    ];

    const signUp = async () => {
        if (email && phone) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password: phone,
            })
            if (error) {
                console.error('Error signing up:', error.message);
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
                console.error('Error inserting data:', insertError.message);
                return;
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
            left: 5
        },
        selectedTextStyle: {
            fontSize: 14,
            fontFamily: 'Poppins-medium',
            left: 5
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
            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 24, left: 4, top: 7 }}>Create a new user</Text>
            <View style={{ flex: 1, top: 30 }}>
                <TextInput
                    onChange={(text: string) => setName(text)}
                    placeholder={'Name'}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    onChange={(text: string) => setEmail(text)}
                    placeholder={'Email'}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    onChange={(text: string) => setPhone(text)}
                    placeholder={'Contact no'}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <TextInput
                    onChange={(text: string) => setNic(text)}
                    placeholder={'Nic no'}
                    containerStyle={{ width: '98%', left: '1%' }}
                ></TextInput>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}

                    iconStyle={styles.iconStyle}
                    data={roles}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select role' : '...'}
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
                    onChange={(text: string) => setAddress(text)}
                    placeholder={'Address'}
                    containerStyle={{ width: '98%', left: '1%', top: 6 }}
                ></TextInput>}
                <Button
                    mode='flat'
                    onPress={() => signUp()}
                    title="Register"
                    containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                    ripple={true}
                />
            </View>

        </SafeAreaView>
    )



}