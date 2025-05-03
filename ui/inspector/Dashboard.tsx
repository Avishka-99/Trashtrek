import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CategoryCard } from '../../components/CategoryCard'
import { FlashList } from '@shopify/flash-list'
import { ICustomerState, IUserState } from '../../store/interfaces'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabase/Supabase'
import IconButton from '@avi99/aui/src/IconButton/IconButton';
import { Camera, CameraView } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { ICustomer } from '../../store/interfaces';
import { setCustomer } from '../../store/CustomerSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
export const Dashboard = () => {
    const [time, setTime] = useState<string | null>(null);
    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const customer: ICustomerState = useSelector((state: any) => state.root.customerReducer);

    console.log(customer);

    const dispatch = useDispatch();
    useEffect(() => {
        const date = new Date();
        let hours = date.getHours();
        if (hours >= 4 && hours < 12) setTime("Good morning,");
        if (hours >= 12 && hours < 17) setTime("Good afternoon,");
        if (hours >= 17 && hours < 21) setTime("Good evening,");
        if (hours >= 21 || hours < 4) setTime("Good night,");
    }, [])



    const cards: { type: 1 | 2 | 3, name: string }[] = [
        { type: 1, name: 'Blue' },
        { type: 2, name: 'Red' },
        { type: 3, name: 'Green' }]


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


    const scanBarCode = async () => {
        Camera.requestCameraPermissionsAsync()
        CameraView.launchScanner({ isGuidanceEnabled: false, barcodeTypes: ['code39'] })
        CameraView.onModernBarcodeScanned(async ({ data }) => {
            if (data) {
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
                const customerData: ICustomer = {
                    blue: wasteData?.blue,
                    green: wasteData?.green,
                    red: wasteData?.red,
                    email: wasteData?.user.user_name,
                    address: wasteData?.user.address,
                    phone: wasteData?.user.contact_no,
                    name: wasteData?.user.nick_name,
                }
                dispatch(setCustomer(customerData));

                CameraView.dismissScanner();
            }
        })

    }



    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: 50, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 27, left: 25 }}>{time} {user.user?.name}</Text>
            </View>
            <View style={{ height: 80, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton title={'Scan barcode'} icon='camera' color='white' onPress={scanBarCode} containerStyle={{ width: Dimensions.get("window").width / 2, height: 60 }} />
            </View>

            {customer.customer &&
                <View style={{ height: 350, width: '98%', borderRadius: 10, left: '1%' }}>
                    <LinearGradient
                        colors={['#3A59D1', '#C68EFD']}
                        style={styles.background}
                        start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }}

                    />
                    <View style={{ height: 100, width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }}>
                            <FontAwesome6 name='circle-user' size={50} color='white' style={{ left: 25, top: 25 }} />
                        </View>
                        <View style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 24, color: 'white' }}>{customer.customer.name}</Text>
                            <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.phone}</Text>
                        </View>


                    </View>
                    <View style={{ width: '100%', height: 210 }}>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'dodgerblue', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.blue?.toFixed(3)} kg</Text>

                            </View>

                        </View>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'tomato', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.red?.toFixed(3)} kg</Text>
                            </View>
                        </View>
                        <View style={{ left: 25, height: 70, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: 'green', borderWidth: 10, borderColor: 'white' }}></View>
                            <View style={{ height: 50, width: '30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-medium', fontSize: 18, color: 'white' }}>{customer.customer.green?.toFixed(3)} kg</Text>
                            </View>
                        </View>

                    </View>

                </View>}
        </SafeAreaView>
    )

}