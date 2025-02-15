import React from 'react';
import { Text, TextInput, StyleSheet, View, Image, SafeAreaView, TouchableOpacity, PixelRatio, StatusBar, ToastAndroid, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { axiosInstance } from '../../config';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice';
import { Home } from '../Home/Home';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
 




export const MainScr = ({ }) => {
  
  const navigation = useNavigation();
  
  const dispatch = useDispatch();


  useEffect(() => {
    const checkUserSession = async () => {
      const userData = await AsyncStorage.getItem('isLoggedIn');
      if (userData) {
        // If user data exists, dispatch loginSuccess and navigate to Home
        const user = JSON.parse(userData);
        console.log(user);
        
        dispatch(loginSuccess(user));
        navigation.navigate('Home');
      }
      else{
        navigation.navigate('Login');
      }
    };

    checkUserSession();
  }, [dispatch, navigation]);
 





  return (
    <></>
  );
};
