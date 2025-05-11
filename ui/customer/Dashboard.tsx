import { View, Text, SafeAreaView, StyleSheet, RefreshControl } from 'react-native'
import React, {  useState } from 'react'
import { CategoryCard } from '../../components/CategoryCard'
import { FlashList } from '@shopify/flash-list'
import { IUserState, IUserWaste } from '../../store/interfaces'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabase/Supabase';
import { common } from '../../Localization/Locale'
import { I18n } from 'i18n-js'
import { Header } from '../../components/Header'
import { setPenalty, setWaste } from '../../store/UserSlice';
import { useDispatch } from 'react-redux';
export const Dashboard = () => {
    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const waste: IUserWaste[] = useSelector((state: any) => state.root.userReducer.waste);
    const [refreshing, setRefreshing] = useState<boolean>(false);
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
    });

    const getDate = () => {
        if (user.user?.current_month) {
            const date = new Date(user.user.current_month);
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
            .eq('user_id', user.user?.id)
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
            setRefreshing(false);
        }


    };


    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={{ height: 40, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 19, left: 25, fontFamily: 'Poppins-medium' }}>{i18n.t('waste_data')} - {getDate()}</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 50, width: '90%', backgroundColor: '#F7374F', left: '5%', borderRadius: 5 }}>
                <Text style={{ fontSize: 19, fontFamily: 'Poppins-medium', color: 'white' }}>{i18n.t('penalty_points')} - {user.penalty ? user.penalty : 0}</Text>


            </View>
            <FlashList
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
            />
            {/* <View style={{ width: '100%', height: 150, borderRadius: 10, backgroundColor: 'dodgerblue', left: '5%', bottom: 10 }}>
            {/* {cards.map((card) => (
                <CategoryCard key={card.type} type={card.type} name={card.name} />
            ))} */}
        </SafeAreaView>
    )
}