import { Dimensions, StatusBar } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native';
import { store } from './store/store';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Signin } from './ui/auth/Signin';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Landing } from './ui/auth/Landing';
import { NavigationContainer } from '@react-navigation/native';
import { Admin } from './ui/admin/Admin';
import { Customer } from './ui/customer/Customer';
import { IUser, IUserState } from './store/interfaces';
//import { NavigationContainer } from '@react-navigation/native/src/index';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Inspector } from './ui/inspector/Inspector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocale } from './store/UserSlice';
import { useDispatch } from 'react-redux';
import { ILocale } from './store/interfaces';
import { Dealer } from './ui/dealer/Dealer';
import React from 'react';


export const App = () => {
  const user: IUserState = useSelector((state: any) => state.root.userReducer);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('locale').then((res) => {
      if (res) {
        const locale: ILocale = {
          locale: res,
        }
        dispatch(setLocale(locale));
      } else {
        AsyncStorage.setItem('locale', 'en');
        const locale: ILocale = {
          locale: 'en',
        }
        dispatch(setLocale(locale));
      }
    });

  }, [])


  return (

    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer >
        {
          user && user.user?.role === 1 ? (
            <Admin />
          )
            : user && user.user?.role === 2 ? (
              < Customer />
            )
              : user && user.user?.role === 3 ? (
                < Inspector />
              ) : user && user.user?.role === 4 ? (
                < Dealer />
              ) : <Landing />

        }
      </NavigationContainer>
    </SafeAreaProvider>
    // {/* <StatusBar barStyle={'dark-content'} /> */ }


  );
}
export default function AppWrapper() {
  let [fontsLoaded] = useFonts({
    'Poppins-light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'SourGummy-italic': require('./assets/fonts/SourGummy-Italic.ttf'),
  });
  if (!fontsLoaded) {
    return <></>;
  } else {
    SplashScreen.hideAsync();
  }


  return (
    <Provider store={store}>
      <App />
      <Toast />
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#000',

  },
});
