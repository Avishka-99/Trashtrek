import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dashboard } from './Dashboard';
import { Feather, FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Settings } from './Settings';
import { IUserState } from '../../store/interfaces';
import { useSelector } from 'react-redux';
import { I18n } from 'i18n-js';
import { signin } from '../../Localization/Locale';
export const Customer = () => {
    const Tab = createBottomTabNavigator();
    const user: IUserState = useSelector((state: any) => state.root.userReducer);
    const i18n = new I18n(signin);
    i18n.enableFallback = true;
    i18n.locale = user?.locale?.locale || 'en';
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    height: 60,
                    elevation: 5,
                    shadowColor: 'black',
                    shadowOffset: { width: 5, height: 5 },
                    backgroundColor: '#fff',
                    borderTopWidth: 3,
                    borderColor: '#76B693',
                    borderTopColor: '#76B693',
                    width: '100%',
                },
            }}
        >
            <Tab.Screen
                name={i18n.t('home')}
                component={Dashboard}
                //initialParams={{id:props.id}}
                options={{
                    headerShown: false,
                    tabBarInactiveTintColor: 'black',
                    tabBarActiveTintColor: 'dodgerblue',
                    tabBarShowLabel: true,
                    tabBarIcon: ({ color, focused }) => <MaterialIcons name='dashboard' size={30} color={focused ? '#76B693' : '#8B8B8B'} />,
                    // tabBarHideOnKeyboard:true
                }}
            />
            <Tab.Screen
                name={i18n.t('settings')}
                component={Settings}
                options={{
                    headerShown: false,
                    tabBarInactiveTintColor: 'black',
                    tabBarActiveTintColor: 'dodgerblue',
                    tabBarShowLabel: true,
                    tabBarIcon: ({ color, focused }) => <FontAwesome name='gear' size={30} color={focused ? '#76B693' : '#8B8B8B'} />,
                }}
            />
        </Tab.Navigator>
    );
}