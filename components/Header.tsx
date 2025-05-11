import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IUserState } from '../store/interfaces';
import { useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import { common } from '../Localization/Locale';
export const Header = () => {
    const [time, setTime] = useState<string | null>(null);
    const user: IUserState = useSelector((state: any) => state.root.userReducer);

    const i18n = new I18n(common);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';


    useEffect(() => {
        const date = new Date();
        let hours = date.getHours();
        if (hours >= 4 && hours < 12) setTime(i18n.t('good_morning'));
        if (hours >= 12 && hours < 17) setTime(i18n.t('good_afternoon'));
        if (hours >= 17 && hours < 21) setTime(i18n.t('good_evening'));
        if (hours >= 21 || hours < 4) setTime(i18n.t('good_night'));
    }, [user?.locale?.locale])


    return (
        <View style={{ height: 50, width: '100%', justifyContent: 'center' }}>
            <Text style={{ fontSize: 27, left: 25 }}>{time} {user.user?.name.includes('') ? user.user?.name.split(' ')[0] : user.user?.name}</Text>
        </View>
    )
}