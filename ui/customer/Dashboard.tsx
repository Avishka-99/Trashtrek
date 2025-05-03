import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CategoryCard } from '../../components/CategoryCard'
import { FlashList } from '@shopify/flash-list'
import { IUserState } from '../../store/interfaces'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabase/Supabase';
import { common } from '../../Localization/Locale'
import { I18n } from 'i18n-js'
import {Header} from '../../components/Header'
export const Dashboard = () => {
    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';


    // const customer: ICustomerState = useSelector((state: any) => state.root.customerReducer);
    

    // useEffect(() => {
    //     const fetchData = async () => {
    //         console.log(user.user?.id);
    //         const { data: wasteData, error } = await supabase
    //             .from('waste_collection')
    //             .select('*')
    //             .eq('id', 1)
    //             .single();
    //         if (wasteData) {
    //             console.log(wasteData);
    //         }
    //     };
    //     fetchData();
    // }, [user])


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
    });

    const getDate = () => {
        if (user.user?.current_month) {
            const date = new Date(user.user.current_month);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return `${month} ${year}`;
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={{ height: 40, width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 19, left: 25, fontFamily: 'Poppins-medium' }}>Waste data for {getDate()}</Text>
            </View>
            <FlashList
                renderItem={({ item }) => <CategoryCard type={item.type} amount={item.amount} category={item.category} />}
                data={user.waste}
                estimatedItemSize={user.waste.length}
                keyExtractor={(item) => item.type.toString()}
                horizontal={false}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
            {/* <View style={{ width: '100%', height: 150, borderRadius: 10, backgroundColor: 'dodgerblue', left: '5%', bottom: 10 }}>
            {/* {cards.map((card) => (
                <CategoryCard key={card.type} type={card.type} name={card.name} />
            ))} */}
        </SafeAreaView>
    )
}