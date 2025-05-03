import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
type CustomIconButtonProps = {
    name: string;
    icon: string;
    color: string;
    id: number;
    onPress: (value: number) => void;
}

export const imageAssets: Record<number, any> = {
    2: require('../assets/customer.png'),
    4: require('../assets/dealer.png'),
    3: require('../assets/inspector.png'),
    // Add all image files you want to support
};

export const CustomIconButton: React.FC<CustomIconButtonProps> = ({ name, icon, color, id, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(id)} style={{ height: 50, display: 'flex', flexDirection: 'row', backgroundColor: color, borderRadius: 25, alignItems: 'center', justifyContent: 'space-around', padding: 5, borderWidth: 2, borderColor: 'black' }}>
            <Image
                source={imageAssets[id]}
                style={{ height: 30, width: 30 }}
                resizeMode='contain' />
            <View style={{ height: 30, width: 5 }}></View>
            <Text style={{ fontFamily: 'Poppins-regular', color: 'black' }}>{name}</Text>
        </TouchableOpacity>
    )
}