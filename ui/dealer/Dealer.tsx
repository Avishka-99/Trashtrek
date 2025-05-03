import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dashboard } from './Dashboard';
import { Feather, FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Settings } from './Settings';
export const Dealer = () => {
    const Tab = createBottomTabNavigator();
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
                name='Home'
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
                name='Settings'
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