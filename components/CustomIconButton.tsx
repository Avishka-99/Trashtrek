import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

export const CustomIconButton = (name: string, icon: string, color: string) => {
    return (
        <TouchableOpacity style={{ height: 50, width: 110, display: 'flex', flexDirection: 'row', backgroundColor: color, borderRadius: 25, alignItems: 'center', justifyContent: 'space-around', padding: 5 }}>
            <Image
                source={require('../assets/' + icon)}
                style={{ height: 30, width: 30 }}
                resizeMode='contain' />
            <View style={{ height: 30, width: 5 }}></View>
            <Text style={{ fontFamily: 'Poppins-regular', color: 'white' }}>{name}</Text>
        </TouchableOpacity>
    )
}