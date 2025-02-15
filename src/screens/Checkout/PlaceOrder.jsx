import React, { useState} from 'react';
import { TouchableOpacity, Text, View, ToastAndroid, Image } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import {SelectAddress} from '../Address/SelectAddress';
import { AppStateStore } from '../../config';

export const PlaceOrder = ({ screenWidth,selectedAddress}) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  //console.log(AppStateStore.selectedAddress1.type,"type");
  

  function placeorder(){

    ToastAndroid.show("Order Placed Successfully", ToastAndroid.SHORT);
  }

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
        paddingBottom: 10, // Extra padding to match the UI
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
        <TouchableOpacity
          style={{
            backgroundColor: '#018f14',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
            flex: 0.6, // 60% width
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => placeorder()}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Place Order
          </Text>
          <ChevronRightIcon size={20} color={'white'} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
      <SelectAddress
        isVisible={isBottomSheetVisible}
        setIsVisible={setBottomSheetVisible}
      />
    </SafeAreaView>
  );
};
