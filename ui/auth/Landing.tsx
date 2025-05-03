import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { Signin } from './Signin';
import { SigninOtp } from './SigninOtp';
import { StackParamList } from '../../Types/StackParamList';
export const Landing = () => {
    const Stack = createStackNavigator<StackParamList>();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#fff' },
            }}
        >
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="SigninOtp" component={SigninOtp} />
        </Stack.Navigator>
    )
}