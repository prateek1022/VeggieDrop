import React ,{ useState} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import {SelectAddress} from '../Address/SelectAddress';

export const NicheWalaButton = ({ screenWidth, show, setShow }) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        width: screenWidth,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
      //  borderTopWidth: 1, // Grey separator line
       // borderTopColor: '#ddd', // Light grey color
        paddingBottom: 0, // Extra padding to match the UI
      }}>
      
      {/* Grey separator above the button
      <View
        style={{
          height: 30, // Height of the grey area
          backgroundColor: 'grey', // Light grey color
          width: '100%',
        }}
      /> */}

      {/* Green Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#018f14',
          paddingHorizontal: 20,
          marginHorizontal: 20,
          paddingVertical: 12,
            marginTop: 0,
          marginBottom: 10,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => setBottomSheetVisible(true)}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold', // Bold text for better visibility
          }}>
          Choose address at next step
        </Text>
        <ChevronRightIcon size={22} color={'white'} />
      </TouchableOpacity>
      <SelectAddress
        isVisible={isBottomSheetVisible}
        setIsVisible={setBottomSheetVisible}
      />
      
    </SafeAreaView>

  );
};
