import { View, Text } from 'react-native'
import React from 'react'

interface UserCardProps {
    name: string;
    phone?: string;
    address?: string;
}


export const UserCard: React.FC<UserCardProps> = ({ name, phone, address }) => {
    console.log(name, phone, address);
    return (
        <View style={{ height: 100, width: '98%', display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: 'black', left: '1%' }}>
            <View style={{ height: 100, width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 80, height: 80, backgroundColor: 'black', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 38 }}>{name?.includes(' ') ? name.split(' ')[0][0] + name.split(' ')[1][0] : name[0] + name[1]}</Text>
                </View>
            </View>
            <View style={{ height: 100, flex: 1 }} >
                <View style={{ height: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 22 }}>{name}</Text>
                </View>
                <View style={{ height: 30, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>{phone}</Text>
                </View>
                <View style={{ height: 30, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>{address}</Text>
                </View>


            </View>
        </View >
    )
}