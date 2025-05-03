import { View, Text } from 'react-native'
import React from 'react'
interface CardProps {
    type: 1 | 2 | 3,
    category?: string,
    amount: number
}



export const CategoryCard: React.FC<CardProps> = ({ type, category, amount }) => {
    return (
        <View style={{ width: '90%', height: 150, borderRadius: 10, backgroundColor: type == 1 ? 'dodgerblue' : type == 2 ? 'tomato' : 'green', left: '5%', bottom: 10 }}>
            <View style={{ height: 50, }}>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 28, color: 'white', left: 10 }}>{category}</Text>
            </View>
            <View style={{ height: 100, display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: "baseline",justifyContent:'flex-end' }}>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 68, color: 'white' }}>{amount.toString().split('.')[0]}.</Text>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 48, color: 'white' }}>{amount.toFixed(3).toString().split('.')[1]} kg</Text>
            </View>




        </View>
    )
}