import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import {
  EllipsisVerticalIcon,
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  XCircleIcon,
} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Loader } from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SelectAddress = ({ show, setShow }) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const { currentUser } = useSelector(state => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);


  const fetchSavedAddresses = async () => {
    try {
      const addresses = await AsyncStorage.getItem('addresses');
      if (addresses) {
        // Parse the stored JSON array into a JavaScript array
        setSavedAddresses(JSON.parse(addresses));
      } else {
        // If no saved addresses found, set it to an empty array
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


  useEffect(() => {
    fetchSavedAddresses();
    // saveAddress();
  }, []);

  return (
    <>
      {!show ? (
        <></>
      ) : (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: screenWidth,
            height: screenHeight,
            zIndex: 2,
            backgroundColor: '#00000066',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              height: 40,
              width: 40,
              alignSelf: 'center',
              marginBottom: 10,
              marginTop: 10,
              borderRadius: 50,
            }}
            onPress={() => setShow(!show)}>
            <XCircleIcon size={40} color="black" />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: 'white',
              width: screenWidth,
              height: screenHeight,
              flexDirection: 'column',
            }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderBottomColor: 'grey',
                borderBottomWidth: 0.5,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 20,
                }}>
                Select Address
              </Text>
            </View>
            <View
              style={{
                padding: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShow(!show);
                  navigation.navigate('AddAddress');
                }}>
                <Text
                  style={{
                    color: 'green',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  + Add new address
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                padding: 10,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                Your saved addresses
              </Text>
            </View>
            <ScrollView
             style={{ flex: 1 }}
             contentContainerStyle={{ paddingBottom: 120 }}>
                {savedAddresses.map((address, index) => (
                  <View
                  key={index}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd', // Light divider for better separation
                  }}>
                  
                  {/* Icon Container */}
                  <View
                    style={{
                      backgroundColor: '#00000020', // Slightly darker for visibility
                      width: 40, // Increased for better proportions
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      marginRight: 12, // Adds spacing between icon & text
                    }}>
                    {(() => {
                      switch (address.type.toLowerCase()) {
                        case 'restaurant':
                          return <HomeIcon size={24} color="#fac107" />;
                        case 'hotel':
                          return <BriefcaseIcon size={24} color="#fac107" />;
                        case 'cafe':
                          return <BuildingOfficeIcon size={24} color="#fac107" />;
                        default:
                          return <MapPinIcon size={24} color="#fac107" />;
                      }
                    })()}
                  </View>
                
                  {/* Address Info with Clickable Area */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Delivery', {
                        address: address,
                      });
                    }}
                    style={{ flex: 1 }}>
                    
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16, // Slightly bigger text for clarity
                          color: 'black',
                        }}>
                        {capitalizeFirstLetter(address.type)}
                      </Text>
                      <Text
                        numberOfLines={2} // Prevents text overflow
                        ellipsizeMode="tail"
                        style={{
                          textAlign: 'left',
                          width: '100%', // Makes it responsive
                          color: 'black',
                          opacity: 0.8, // Slightly faded for a subtle effect
                        }}>
                        {address.completeAddress}
                      </Text>
                    </View>
                  </TouchableOpacity>
                
                </View>
                
                ))}

               
              
              </ScrollView> 
          </View>
        </View>
      )}
    </>
  );
};
