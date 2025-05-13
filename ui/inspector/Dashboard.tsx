import { View, Text, SafeAreaView, StyleSheet, RefreshControl, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ICustomerState, IUserState } from '../../store/interfaces'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabase/Supabase'
import IconButton from '@avi99/aui/src/IconButton/IconButton';
import { Camera, CameraView } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { ICustomer } from '../../store/interfaces';
import { setCustomer } from '../../store/CustomerSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/Header'
import { common } from '../../Localization/Locale'
import { I18n } from 'i18n-js'
import { ScrollView } from 'react-native'
import Button from '@avi99/aui/src/Buttons/Button';
import Toast from 'react-native-toast-message';
import TextInput from '@avi99/aui/src/Textinput/TextInput';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export const Dashboard = () => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [user_id, setUserId] = useState<number | null>(null);
    const [waste_id, setWasteId] = useState<number | null>(null);
    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const [blueValue, setBlueValue] = useState<string>('0');
    const [redValue, setRedValue] = useState<string>('0');
    const [greenValue, setGreenValue] = useState<string>('0');

    const [blueInputKey, setBlueInputKey] = useState<number>(0);
    const [redInputKey, setRedInputKey] = useState<number>(1000);
    const [greenInputKey, setGreenInputKey] = useState<number>(2000);

    const [userId, setUserIdNum] = useState<number | null>(null);

    const customer: ICustomerState = useSelector((state: any) => state.root.customerReducer);

    const dispatch = useDispatch();

    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '90%',
            backgroundColor: 'white',
        },
        background: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
            borderRadius: 10,
        },
        button: {
            padding: 15,
            alignItems: 'center',
            borderRadius: 5,
        },
        text: {
            backgroundColor: 'transparent',
            fontSize: 15,
            color: '#fff',
        },
    });

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
    const scanBarCode = async () => {
        Camera.requestCameraPermissionsAsync()
        CameraView.launchScanner({ isGuidanceEnabled: false, barcodeTypes: ['code39'] })
        CameraView.onModernBarcodeScanned(async ({ data }) => {
            if (data) {
                CameraView.dismissScanner();
                setUserId(parseInt(data));

                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const startDate = new Date(year, month, 1).toISOString();
                const endDate = new Date(year, month + 1, 1).toISOString();
                const { data: wasteData, error } = await supabase
                    .from('waste_collection')
                    .select(`*,user(user_name,address,contact_no,nick_name)`)
                    .eq('user_id', data)
                    .gt('created_at', startDate)
                    .lte('created_at', endDate)
                    .single();
                if (!wasteData) {
                    const { data: insert_data, error } = await supabase
                        .from('waste_collection')
                        .insert([
                            { blue: 0, red: 0, green: 0, penalty: 0, user_id: data }
                        ]);
                    const { data: wasteData_2, error: fetch_err } = await supabase
                        .from('waste_collection')
                        .select(`*,user(user_name,address,contact_no,nick_name)`)
                        .eq('user_id', data)
                        .gt('created_at', startDate)
                        .lte('created_at', endDate)
                        .single();
                    setWasteId(parseInt(wasteData_2.id));
                    const customerData: ICustomer = {
                        blue: wasteData_2?.blue,
                        green: wasteData_2?.green,
                        red: wasteData_2?.red,
                        email: wasteData_2?.user.user_name,
                        address: wasteData_2?.user.address,
                        phone: wasteData_2?.user.contact_no,
                        name: wasteData_2?.user.nick_name,
                        penalty: wasteData_2?.penalty,
                    }
                    dispatch(setCustomer(customerData));



                } else {
                    setWasteId(parseInt(wasteData.id));
                    const customerData: ICustomer = {
                        blue: wasteData?.blue,
                        green: wasteData?.green,
                        red: wasteData?.red,
                        email: wasteData?.user.user_name,
                        address: wasteData?.user.address,
                        phone: wasteData?.user.contact_no,
                        name: wasteData?.user.nick_name,
                        penalty: wasteData?.penalty,
                    }
                    dispatch(setCustomer(customerData));



                }

            } else {
                showToast('error', 'No data found');
            }
        })

    }
    const refreshData = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 1).toISOString();
        const { data: wasteData, error } = await supabase
            .from('waste_collection')
            .select(`*,user(user_name,address,contact_no,nick_name)`)
            .eq('user_id', user_id)
            .gt('created_at', startDate)
            .lte('created_at', endDate)
            .single();
        const customerData: ICustomer = {
            blue: wasteData?.blue,
            green: wasteData?.green,
            red: wasteData?.red,
            email: wasteData?.user.user_name,
            address: wasteData?.user.address,
            phone: wasteData?.user.contact_no,
            name: wasteData?.user.nick_name,
            penalty: wasteData?.penalty,
        }
        dispatch(setCustomer(customerData));
    }


    const reFreshData = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 1).toISOString();
        const { data: wasteData, error } = await supabase
            .from('waste_collection')
            .select(`*,user(user_name,address,contact_no,nick_name)`)
            .eq('user_id', user_id)
            .gt('created_at', startDate)
            .lte('created_at', endDate)
            .single();
        const customerData: ICustomer = {
            blue: wasteData?.blue,
            green: wasteData?.green,
            red: wasteData?.red,
            email: wasteData?.user.user_name,
            address: wasteData?.user.address,
            phone: wasteData?.user.contact_no,
            name: wasteData?.user.nick_name,
            penalty: wasteData?.penalty,
        }
        dispatch(setCustomer(customerData));

    }
    const onRefresh = () => {
        setRefreshing(true);
        reFreshData();
        setRefreshing(false);


    };

    const addPenalty = async () => {
        const { data, error } = await supabase
            .from('waste_collection')
            .update({ penalty: customer.customer?.penalty ? customer.customer?.penalty + 1 : 1 })
            .eq('id', waste_id); // Filter the row to update

        if (error) {
            showToast('error', error.message)
        } else {
            showToast('success', 'Penalty added successfully!')
            refreshData();
        }
    }

    const updateData = async () => {
        const { data, error } = await supabase
            .from('waste_collection')
            .select(`blue,red,green`)
            .eq('id', waste_id)
            .single();
        if (data) {
            const blue = parseFloat(blueValue) + parseFloat(data.blue);
            const red = parseFloat(redValue) + parseFloat(data.red);
            const green = parseFloat(greenValue) + parseFloat(data.green);

            const { data: wasteUpdateData, error } = await supabase
                .from('waste_collection')
                .update({ blue: blue, red: red, green: green })
                .eq('id', waste_id);
            if (error) {
                showToast('error', error.message);
            } else {
                showToast('success', 'Data updated successfully!');
                reFreshData();
            }
        }
        setGreenInputKey(greenInputKey + 1);
        setRedInputKey(redInputKey + 1);
        setBlueInputKey(blueInputKey + 1);
        setBlueValue('0');
        setRedValue('0');
        setGreenValue('0');

    }

    const getUserData = async () => {
        if (userId) {
            setUserId(userId);
            const { data: user, error: user_err } = await supabase
                .from('user')
                .select('role')
                .eq('id', userId)
                .single();
            if (user) {
                if (user.role == 2) {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth();
                    const startDate = new Date(year, month, 1).toISOString();
                    const endDate = new Date(year, month + 1, 1).toISOString();
                    const { data: wasteData, error } = await supabase
                        .from('waste_collection')
                        .select(`*,user(user_name,address,contact_no,nick_name)`)
                        .eq('user_id', userId)
                        .gt('created_at', startDate)
                        .lte('created_at', endDate)
                        .single();
                    if (!wasteData) {
                        const { data: insert_data, error } = await supabase
                            .from('waste_collection')
                            .insert([
                                { blue: 0, red: 0, green: 0, penalty: 0, user_id: userId }
                            ]);
                        const { data: wasteData_2, error: fetch_err } = await supabase
                            .from('waste_collection')
                            .select(`*,user(user_name,address,contact_no,nick_name)`)
                            .eq('user_id', userId)
                            .gt('created_at', startDate)
                            .lte('created_at', endDate)
                            .single();
                        setWasteId(parseInt(wasteData_2.id));
                        const customerData: ICustomer = {
                            blue: wasteData_2?.blue,
                            green: wasteData_2?.green,
                            red: wasteData_2?.red,
                            email: wasteData_2?.user.user_name,
                            address: wasteData_2?.user.address,
                            phone: wasteData_2?.user.contact_no,
                            name: wasteData_2?.user.nick_name,
                            penalty: wasteData_2?.penalty,
                        }
                        dispatch(setCustomer(customerData));



                    } else {
                        setWasteId(parseInt(wasteData.id));
                        const customerData: ICustomer = {
                            blue: wasteData?.blue,
                            green: wasteData?.green,
                            red: wasteData?.red,
                            email: wasteData?.user.user_name,
                            address: wasteData?.user.address,
                            phone: wasteData?.user.contact_no,
                            name: wasteData?.user.nick_name,
                            penalty: wasteData?.penalty,
                        }
                        dispatch(setCustomer(customerData));



                    }
                } else {
                    showToast('error', 'User is not a customer');
                }


            } else {
                showToast('error', 'User not found');
            }

        } else {
            showToast('error', 'Please enter a valid user id');
        }
    }




    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={{ height: 80, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <IconButton title={i18n.t('Scan').length > 15 ? i18n.t('Scan').substring(0, 15).concat('..') : i18n.t('Scan')} icon='camera' color='white' onPress={scanBarCode} containerStyle={{ height: 60 }} />
                <View style={{ width: 180, height: 60, display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                        key={redInputKey}
                        onChange={(text: string) => setUserIdNum(parseInt(text))}
                        placeholder={i18n.t('user_id')}
                        containerStyle={{ width: '70%', height: 60 }}
                    ></TextInput>
                    <View style={{ width: 60, height: 60, display: 'flex', justifyContent: 'center', backgroundColor: 'white' }}>
                        <TouchableOpacity onPress={getUserData}>
                            <View style={{ width: 40, height: 40, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'dodgerblue' }}>
                                <FontAwesome name='search' size={24} color='white' />
                            </View>
                        </TouchableOpacity>


                    </View>
                </View>

            </View>

            {customer.customer && <KeyboardAwareScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['grey']}
                    progressBackgroundColor={'black'}
                />
            }

            >

                <View style={{ height: 320, width: '98%', borderRadius: 10, left: '1%' }}>
                    <LinearGradient
                        colors={['#3A59D1', '#C68EFD']}
                        style={styles.background}
                        start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }}

                    />

                    <View style={{ height: 100, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 60, height: 60, backgroundColor: 'black', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', left: 20 }}>
                            <Text style={{ color: 'white', fontSize: 38 }}>{customer.customer.name?.includes(' ') ? customer.customer.name.split(' ')[0][0] + customer.customer.name.split(' ')[1][0] : customer.customer.name?.substring(0, 1)}</Text>
                        </View>
                        <View style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', left: 25 }}>
                            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 24, color: 'white' }}>{customer.customer.name}</Text>
                            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.phone}</Text>
                        </View>


                    </View>
                    <View style={{ width: '100%', height: 210 }}>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'dodgerblue', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.blue?.toFixed(3)} {i18n.t('kg')}</Text>

                            </View>

                        </View>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'tomato', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.red?.toFixed(3)} {i18n.t('kg')}</Text>
                            </View>
                        </View>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'green', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.green?.toFixed(3)} {i18n.t('kg')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: '98%', left: '1%', height: 120, backgroundColor: '#BDE8CA', borderRadius: 5, top: '1%' }}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TextInput
                            key={blueInputKey}
                            onChange={(text: string) => setBlueValue(text)}
                            placeholder={i18n.t('Blue')}
                            containerStyle={{ width: '30%' }}
                        ></TextInput>
                        <TextInput
                            key={redInputKey}
                            onChange={(text: string) => setRedValue(text)}
                            placeholder={i18n.t('Red')}
                            containerStyle={{ width: '30%' }}

                        ></TextInput>
                        <TextInput
                            key={greenInputKey}
                            onChange={(text: string) => setGreenValue(text)}
                            placeholder={i18n.t('Green_2')}
                            containerStyle={{ width: '30%' }}
                        ></TextInput>
                    </View>
                    <Button
                        mode='flat'
                        onPress={() => updateData()}
                        title={i18n.t('Add')}
                        containerStyle={{ width: '98%', marginTop: 20, left: '1%' }}
                        ripple={true}
                    />

                </View>

                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 50, width: '98%', backgroundColor: '#F95454', left: '1%', borderRadius: 5, marginTop: 20 }}>
                    <Text style={{ fontSize: 19, fontFamily: 'Poppins-medium', color: 'white' }}>{i18n.t('penalty_points')} - {customer.customer.penalty ? customer.customer.penalty : 0}</Text>
                </View>





                <Button
                    mode='flat'
                    onPress={() => addPenalty()}
                    title={i18n.t('add_penalty')}
                    containerStyle={{ width: '98%', top: '2%', left: '1%', backgroundColor: '#FB4141', borderColor: '#FB4141' }}
                    ripple={true}
                />

            </KeyboardAwareScrollView>}




        </SafeAreaView>
    )

}