import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import IconButton from '@avi99/aui/src/IconButton/IconButton';
import { supabase } from '../../supabase/Supabase';
export const Dashboard = () => {

    useEffect(() => {
        const fetchUsers = async () => {
            const { data: { users }, error } = await supabase.auth.admin.listUsers()
            if (error) {
                console.log('Error fetching users:', error.message);
            } else {
                console.log('Users:', users);
            }

        }
        fetchUsers();



    }, [])

    const userTypes: { label: string, icon: string }[] = [
        { label: 'Customer', icon: 'customer.png' },
        { label: 'Dealers', icon: 'dealer.png' },
        { label: 'Inspectors', icon: 'inspector.png' },
    ];

    return (
        <SafeAreaView>
            <IconButton title={'New user'} icon='plus-circle-outline' color='white' onPress={() => console.log('clicked')} containerStyle={{ width: Dimensions.get("window").width / 2, height: 60 }} />
        </SafeAreaView>

    )
}