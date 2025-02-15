import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CartItems } from './CartItems';
import { Coupon } from './Coupon';
import { calculateTotalPrice } from '../../utils/utils';
import { useFocusEffect } from "@react-navigation/native";
import { Bill } from './Bill';
import { LastText } from './LastText';
import { NicheWalaButton } from './NicheWalaButton';
import { PlaceOrder } from './PlaceOrder';
import { SelectAddress } from '../Address/SelectAddress3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartAddingItemsMessage from './StartAddingItemsMessage';
import { useNavigation } from '@react-navigation/native';
import { CartSubItems} from './CartSubItems';
import { AppStateStore } from '../../config'; 
import { store } from '../../redux/store';

const OneTimePurchase = ({ screenWidth, cartItems, total, }) => (

  <SafeAreaView>
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      {cartItems.length < 1 ? (
        <StartAddingItemsMessage />
      ) : (
        <>
          <CartItems screenWidth={screenWidth} cartItems={cartItems}  />
          <Coupon screenWidth={screenWidth} />
          <Bill screenWidth={screenWidth} total={total} />
          <LastText
            title="Order for Someone else"
            description="Add a message to be sent as an SMS with your gift."
            screenWidth={screenWidth}
            show={true}
          />
          <LastText
            title="Cancellation Policy"
            description="Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable."
            screenWidth={screenWidth}
            show={false}
          />
        </>
      )}
    </ScrollView>
  </SafeAreaView>
);

const Subscription = ({ screenWidth, cartSubItems, total, }) => (
  <SafeAreaView>
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      {cartSubItems.length < 1 ? (
        <StartAddingItemsMessage />
      ) : (
        <>
          <CartSubItems screenWidth={screenWidth} cartItems={cartSubItems} />
          <Coupon screenWidth={screenWidth} />
          <Bill screenWidth={screenWidth} total={total} />
          <LastText
            title="Order for Someone else"
            description="Add a message to be sent as an SMS with your gift."
            screenWidth={screenWidth}
            show={true}
          />
          <LastText
            title="Cancellation Policy"
            description="Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable."
            screenWidth={screenWidth}
            show={false}
          />
        </>
      )}
    </ScrollView>
  </SafeAreaView>
);

export const Checkout = ({route}) => {
  const [subOn, setSubOn] = useState(route.params?.subOn ?? false); // Store in state
  

  useEffect(() => {
    if (route.params?.subOn !== undefined) {
      setSubOn(route.params.subOn); // Update if new param is passed
    }
  }, [route.params]);
  
  const selectedAddress = useSelector((state) => state.address.selectedAddress); // Re-run when AppStateStore.selectedAddress1 changes
  
  const screenWidth = Dimensions.get('window').width;
  const cartItems = useSelector(state => state.cart);
  const cartSubItems = useSelector(state => state.cartSub.items);
  const total = calculateTotalPrice(cartSubItems);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(subOn ? 0 : 1); 

  const translateX = useRef(new Animated.Value(0)).current;

  const handleTabChange = (index) => {
    setActiveTab(index); // Update the active tab
  };

  useEffect(() => {
    // Update translateX whenever activeTab changes
    Animated.timing(translateX, {
      toValue: -activeTab * screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);  

  const getAddress = async () => {
    try {
      const storedAddress = selectedAddress;
      //console.log("Stored Addressy:", storedAddressy);
      console.log("Stored Address:", storedAddress);
            
      if (storedAddress !== null) {
        console.log("Stored Address:", storedAddress);

        //setSelectedAddress(JSON.parse(storedAddress)); // Convert to JSON
        setSelectedAddress(storedAddress)
      } else {
        console.log("No address found");

        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Error retrieving address:", error);
    }
  };

  // Fetch address when component mounts
  useEffect(() => {
    console.log(selectedAddress,"seljf");
    
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getAddress();
  //   }, [])
  // );
  return (
    <>
      <StatusBar backgroundColor="white" />
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabChange(0)} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
            Tomorrow's Orders
          </Text>
          {activeTab === 0 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange(1)} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Rest Of The Month
          </Text>
          {activeTab === 1 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Animated Content */}
      <Animated.View style={[styles.animatedContent, { width: screenWidth * 2, transform: [{ translateX }] }]}>


        <View style={{ width: screenWidth }}>
          <OneTimePurchase
            screenWidth={screenWidth}
            cartItems={cartItems}
            total={calculateTotalPrice(cartItems)}
          />
        </View>
        <View style={{ width: screenWidth }}>
          <Subscription
            screenWidth={screenWidth}
            cartSubItems={cartSubItems}
            total={calculateTotalPrice(cartSubItems)} />
        </View>
      </Animated.View>


      {
        (cartItems.length > 0 || cartSubItems.length > 0) ? (
          selectedAddress.isStored ? (
            <PlaceOrder screenWidth={screenWidth} selectedAddress={selectedAddress} />
          ) : (
            <NicheWalaButton show={show} setShow={setShow} screenWidth={screenWidth} />
          )
        ) : null // If cartItems and cartSubItems are both empty, render nothing
      }


      <SelectAddress show={show} setShow={setShow} />
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    color: 'grey',
    fontSize: 16,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  activeTabText: {
    color: 'black',
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: 'green',
    width: '100%',
  },

  scrollContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    marginBottom: 49,
  },
  scrollContent: {
    padding: 10,
    gap: 20,
  },

  subscriptionBox: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subscriptionDescription: {
    marginTop: 10,
  },
  animatedContent: {
    flexDirection: 'row',
  },
});
