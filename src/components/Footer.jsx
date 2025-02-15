import React from 'react';
import {
  SafeAreaView,
  Dimensions,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ArrowRightIcon} from 'react-native-heroicons/outline';
import * as Progress from 'react-native-progress';
import {useSelector} from 'react-redux';
import {calculateTotalPrice} from '../utils/utils';
import {useNavigation} from '@react-navigation/native';

export const Footer = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const cartItems = useSelector(state => state.cart);
  const cartSubItems = useSelector(state => state.cartSub.items);
  const cartData = cartItems.length > 0 ? cartItems : cartSubItems;
  const totalPercentage = calculateTotalPrice(cartItems) / 99;
  return (
    <>
      <SafeAreaView
        style={{
          position: 'absolute',
          bottom: 0,
        }}>
        <SafeAreaView
          style={{
            width: screenWidth,
            height: 55,
            backgroundColor: '#c2fbfc',
            paddingLeft:20, 
            paddingTop:5,
            paddingBottom:30,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: 40,
              height: 35,
              alignItems: 'center',
              padding: 5,
              borderRadius: 5,
            }}>
            <Image source={require('../images/deliver.png')} />
          </View>
          <View>
            {calculateTotalPrice(cartItems) < 99 ? (
              <Text
                style={{
                  color: '#0841fc',
                  fontWeight: 'bold',
                }}>
                FREE delivery
              </Text>
            ) : (
              <Text
                style={{
                  color: '#0841fc',
                  fontWeight: 'bold',
                }}>
                Yay! You got FREE Delivery
              </Text>
            )}
            {calculateTotalPrice(cartItems) > 99 ? (
              <Text
                style={{
                  color: 'black',
                }}>
                No coupon needed
              </Text>
            ) : cartItems.length === 0 ? (
              <Text
                style={{
                  color: 'black',
                }}>
                on orders above ₹99
              </Text>
            ) : (
              <Text
                style={{
                  color: 'black',
                }}>
                Add Items Worth ₹{99 - calculateTotalPrice(cartData)} more
              </Text>
            )}
            {calculateTotalPrice(cartData) < 99 &&
              calculateTotalPrice(cartData) !== 0 && (
                <Progress.Bar
                  height={2}
                  progress={totalPercentage}
                  width={screenWidth * 0.7}
                />
              )}
          </View>
        </SafeAreaView>
        {(cartData.length > 0 ) && (
          <>
            <SafeAreaView
              style={{
                width: screenWidth,
                height: 70,
                backgroundColor: 'white',
                padding: 20,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    height: 35,
                    width: 35,
                    padding: 2,
                    borderWidth: 0.5,
                    borderRadius: 5,
                    borderColor: 'grey',
                  }}>
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={{uri: cartData[cartData.length - 1].banner}}
                  />
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: 'black',
                    }}>
                    {cartData.length} ITEMS
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const subOn = cartItems.length > 0; 
                  navigation.navigate('Checkout',{subOn});
                }}
                style={{
                  backgroundColor: '#018f14',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 50,
                  height: 40,
                  borderRadius: 5,
                  flexDirection: 'row',
                  gap: 5,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 20,
                  }}>
                  Next
                </Text>
                <ArrowRightIcon color="white" size={20} />
              </TouchableOpacity>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </>
  );
};
