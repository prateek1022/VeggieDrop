import React, { useState} from 'react';
import { TouchableOpacity, Text, View, ToastAndroid, Image } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import {SelectAddress} from '../Address/SelectAddress';
import { axiosInstance_shopp } from '../../config';
import { AppStateStore } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";


export const PlaceOrder = ({ screenWidth,selectedAddress,setShowOverlay, setShowBasket, setShowConfirm,navigation}) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  //console.log(AppStateStore.selectedAddress1.type,"type");
  const cartItems = useSelector(state => state.cart);
  const placeOrder = async () => {
    
    console.log("ddd");
    
   const userToken = await AsyncStorage.getItem('userToken');
   console.log(userToken,"userToken");
   
  
    console.log(cartItems,"caw1aqartItems");
  

    try {
      const response = await axiosInstance_shopp.post(
        "/order",
        {
          "payment_mode": "offline",
          "payment_method": "upi",
          "payment_done": false,
          "products": cartItems, 
          "total": 6.8,
          "address": selectedAddress,
          "status": "pending"
        }
        , 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data,"dkfk");
        setShowBasket(false)
        setShowConfirm(true);
        //ToastAndroid.show( JSON.stringify( response.data,null,2), ToastAndroid.SHORT);
        setTimeout(() => {
         // runOnJS(placeOrder)();
          
          navigation.replace("OrderSummary", { orderData: response.data });
          
        }, 3000);
        
        console.log(response.data);
        
      } else {
        console.log("⚠️ Unexpected response:", response.status);
      }
    } catch (error) {
          // Extract error response message
          let errorMessage = "Something went wrong";
          
          if (error.response) {
              // Server responded with a status code outside the 2xx range
              console.log("Server Error Response:", error.response.data);
              errorMessage = error.response.data.message || "Server error occurred";
          } else if (error.request) {
              // Request was made but no response received
              console.log("No response received:", error.request);
              errorMessage = "No response from server";
          } else {
              // Something else happened
              console.log("Request Error:", error.message);
              errorMessage = error.message;
          }
      
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
  };

  const waveProgress = useSharedValue(0);
  const animatedWaveStyle = useAnimatedStyle(() => {
    return {
      // position: 'absolute', // Fill the entire button
      // top: 0,
      // left: 0,
      // right: 0,
      // bottom: 0,
      // backgroundColor: "#016b10", // Wave color
      // opacity: 0.5, // Optional transparency
      // transform: [{ scaleX: waveProgress.value }], // Expands left to right
      // borderRadius: 10, // Match button border radius


      position: 'absolute',
      top: 0,
      left: 0, // ✅ Start from the left
      right: 0,
      bottom: 0,
     // height: '100%', // Cover full height of the button
     width: waveProgress.value * (screenWidth * 0.6), // ✅ Expands width from 0% to 100%
      backgroundColor: "#1f3809",
      opacity: 0.5, // Optional transparency
      borderRadius: 10, // Match button border radius
    };
  });
  

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        width: screenWidth,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        marginTop: 100,
         // Light grey color
        paddingBottom: 60, // Extra padding to match the UI
      }}>
      
      {/* Grey separator above the button */}
      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ededed',
        paddingLeft:30,
        padding: 8,
      }}>
      
      {/* Left: Address Type Icon */}
      <Image
        source={require('../../images/calendar.png')} // Replace with your image path
        style={{ width: 30, height: 30, marginRight: 10 }}
      />

      {/* Middle: Address Details */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize:12 }}>Delivering to {selectedAddress.type}</Text>
        <Text style={{  fontSize:12 }}numberOfLines={1} ellipsizeMode="tail">{selectedAddress.completeAddress}</Text>
      </View>

      {/* Right: Change Button */}
      <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
        <Text style={{ color: 'green', fontWeight: 'bold' }}>Change</Text>
      </TouchableOpacity>

    </View>

      {/* Bottom section with 2 parts (Button + Payment Method) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
          marginTop: 7,
        }}>
        
        {/* Left Side: Choose Address Button (60%) */}
        <View
          style={{
            flex: 0.35, // 35-40% width
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            backgroundColor: 'white',
            marginLeft: 10, // Space between buttons
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Paytm UPI
          </Text>
        </View>

        

        {/* Right Side: Payment Method (40%) */}
        <View
      style={{
        flex: 0.6, // Same width as button
        borderRadius: 10, // Same border radius
        overflow: 'hidden', // Prevents overflow animation
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: '#018f14',
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          waveProgress.value = 0; // Reset animation
          waveProgress.value = withTiming(1, { duration: 1200 }); // Animate wave

          setTimeout(() => {
            //runOnJS(placeOrder)();
            setShowOverlay(true);
            setShowBasket(true)
            setTimeout(() => {
              runOnJS(placeOrder)();
              
              
              
            }, 5000);
          }, 1200);
        }}
      >
        <Animated.View style={animatedWaveStyle} />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Place Order</Text>
        <ChevronRightIcon size={20} color={'white'} style={{ marginLeft: 5 }} />
      </TouchableOpacity>
    </View>
      </View>
      <SelectAddress
        isVisible={isBottomSheetVisible}
        setIsVisible={setBottomSheetVisible}
      />
    </SafeAreaView>
  );
};
