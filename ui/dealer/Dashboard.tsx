import { View, Text, SafeAreaView, StyleSheet, RefreshControl } from 'react-native'
import React, {  useState } from 'react'
import { CategoryCard } from '../../components/CategoryCard'
import { FlashList } from '@shopify/flash-list'
import { ICustomerState, IUserState, IUserWaste } from '../../store/interfaces'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabase/Supabase'
import { useDispatch } from 'react-redux';
import { common } from '../../Localization/Locale'
import { I18n } from 'i18n-js'
import { Header } from '../../components/Header'
import {  setWaste } from '../../store/UserSlice'
export const Dashboard = () => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const waste: IUserWaste[] = useSelector((state: any) => state.root.userReducer.waste);
    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';

    const dispatch = useDispatch();

    const getDate = () => {
        if (user.user?.current_month) {
            const date = new Date(); // current date
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return `${i18n.t(month)} ${year}`;
        }

    }
    const onRefresh = async () => {
        setRefreshing(true);
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
            setRefreshing(false);
        }

    };

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


    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={{ height: 40, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 19, left: 25, fontFamily: 'Poppins-medium' }}>{i18n.t('waste_data')} - {getDate()}</Text>
            </View>
            {waste.length > 0 && <FlashList
                renderItem={({ item }) => <CategoryCard type={item.type} amount={item.amount} category={item.type == 1 ? i18n.t('Blue') : item.type == 2 ? i18n.t('Red') : i18n.t('Green')} kg={i18n.t('kg')} />}
                data={waste}
                estimatedItemSize={waste.length}
                keyExtractor={(item) => item.type.toString()}
                horizontal={false}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['grey']}
                        progressBackgroundColor={'black'}
                    />
                }
            />}


        </SafeAreaView>
    )

}