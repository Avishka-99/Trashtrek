import { View, Text, SafeAreaView, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase/Supabase';
import { useSelector } from 'react-redux';
import { IUserState } from '../../store/interfaces';
import { I18n } from 'i18n-js';
import { common } from '../../Localization/Locale';
import { Header } from '../../components/Header';
import { FlashList } from '@shopify/flash-list';
import { CustomIconButton } from '../../components/CustomIconButton';
import { UserCard } from '../../components/UserCard';
import { IUsers } from '../../store/interfaces';
import { useDispatch } from 'react-redux';
import { setUsers } from '../../store/AdminSlice';
export const Dashboard = () => {
    const dispatch = useDispatch();
    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const users: IUsers[] = useSelector((state: any) => state.root.AdminReducer.users);

    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';
    const fetchUsers = async (id: number) => {
        const { data: user, error: user_err } = await supabase
            .from('user')
            .select('contact_no,nick_name,address')
            .eq('role', id);

        if (user) {
            console.log(user);
            dispatch(setUsers(user as IUsers[]));

        }


    }
    useEffect(() => {

        fetchUsers(1);
    }, [])

    const userTypes: { label: string, icon: string, id: number }[] = [
        { label: i18n.t('admin_customer_label'), icon: 'customer.png', id: 2 },
        { label: i18n.t('admin_dealer_label'), icon: 'dealer.png', id: 4 },
        { label: i18n.t('admin_inspector_label'), icon: 'inspector.png', id: 3 },
    ];
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '90%',
            backgroundColor: 'white',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <FlashList
                renderItem={({ item }) => <CustomIconButton name={item.label} icon={item.icon} color={'white'} id={item.id} onPress={fetchUsers} />}
                data={userTypes}
                estimatedItemSize={userTypes.length}
                keyExtractor={(item) => item.label.toString()}
                horizontal={true}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0, paddingTop: 60 }}
                ItemSeparatorComponent={() => <View style={{ height: 20, width: 3 }} />}
            />
            {users && <FlashList
                renderItem={({ item }) => <UserCard name={item.nick_name} address={item.address} phone={item.contact_no} />}
                data={users}
                estimatedItemSize={users.length}
                keyExtractor={(item) => item?.nick_name?.toString()}
                horizontal={false}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
                ItemSeparatorComponent={() => <View style={{ height: 20, width: 3 }} />}
            />}


            {/* <View style={{ width: '100%', height: 150, borderRadius: 10, backgroundColor: 'dodgerblue', left: '5%', bottom: 10 }}>
            {/* {cards.map((card) => (
                <CategoryCard key={card.type} type={card.type} name={card.name} />
            ))} */}
        </SafeAreaView>
    )
}