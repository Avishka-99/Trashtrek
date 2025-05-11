import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { IUserState } from '../store/interfaces';
import { I18n } from 'i18n-js';
import { common } from '../Localization/Locale';
interface CardProps {
    type: 1 | 2 | 3,
    category?: string,
    amount: number,
    kg?: string,
}




export const CategoryCard: React.FC<CardProps> = ({ type, category, amount, kg }) => {
    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';
    return (
        <View style={{ width: '90%', height: 150, borderRadius: 10, backgroundColor: type == 1 ? 'dodgerblue' : type == 2 ? '#FB4141' : '#5CB338', left: '5%', bottom: 10 }}>
            <View style={{ height: 50, }}>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 28, color: 'white', left: 10 }}>{type == 1 ? i18n.t('Blue') : type == 2 ? i18n.t('Red') : i18n.t('Green')}</Text>
            </View>
            <View style={{ height: 100, display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: "baseline", justifyContent: 'flex-end' }}>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 68, color: 'white' }}>{amount.toString().split('.')[0]}.</Text>
                <Text style={{ fontFamily: 'Poppins-regular', fontSize: 48, color: 'white' }}>{amount.toFixed(3).toString().split('.')[1]} {i18n.t('kg')}</Text>
            </View>




        </View>
    )
}