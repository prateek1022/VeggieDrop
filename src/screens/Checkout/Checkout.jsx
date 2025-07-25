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
import { PlaceOrderSub } from './PlaceOrderSub';
import { SelectAddress } from '../Address/SelectAddress3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartAddingItemsMessage from './StartAddingItemsMessage';
import { useNavigation } from '@react-navigation/native';
import { CartSubItems } from './CartSubItems';
import { AppStateStore } from '../../config';
import { store } from '../../redux/store';
import { Modal } from 'react-native';
import LottieView from "lottie-react-native";
const textArray = ["Confirming your order...", "Placing the order....", "Nearly done....."];

const OneTimePurchase = ({ screenWidth, cartItems, total, selectedAddress, setShowOverlay, setShowBasket, setShowConfirm,navigation }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1, minHeight: Dimensions.get("window").height, paddingBottom: 100 }} >
        {cartItems.length < 1 ? (
           <View style={{ flex: 1, justifyContent: "center", alignItems: "center", minHeight: Dimensions.get("window").height }}>
    <StartAddingItemsMessage />
  </View>
        ) : (
          <>
            <CartItems screenWidth={screenWidth} cartItems={cartItems} />
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
    </View>

    {/* Fixed at Bottom */}
    {cartItems.length > 0 && (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
    {selectedAddress.isStored ? (
      <PlaceOrder 
        screenWidth={screenWidth} 
        selectedAddress={selectedAddress} 
        setShowOverlay={setShowOverlay} 
        setShowBasket={setShowBasket} 
        setShowConfirm={setShowConfirm}
        navigation={navigation}
      />
    ) : (
      <NicheWalaButton screenWidth={screenWidth} />
    )}
  </View>
)}

  </SafeAreaView>
);


const Subscription = ({ screenWidth, cartSubItems, total, selectedAddress }) => (
  <SafeAreaView>
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1, minHeight: Dimensions.get("window").height, paddingBottom: 100 }} >
      {cartSubItems.length < 1 ? (
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", minHeight: Dimensions.get("window").height }}>
    <StartAddingItemsMessage />
  </View>
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
    {
      (cartSubItems.length > 0) ? (
        
        selectedAddress.isStored ? (
          <PlaceOrderSub screenWidth={screenWidth} selectedAddress={selectedAddress} />
        ) : (
          <NicheWalaButton screenWidth={screenWidth} />
        )
      ) : null // If cartItems and cartSubItems are both empty, render nothing
    }
  </SafeAreaView>
);

export const Checkout = ({ route }) => {
  const [subOn, setSubOn] = useState(route.params?.subOn ?? false); // Store in state
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBasket, setShowBasket] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Step 1: Fade Out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600, // Fade-out duration
        useNativeDriver: true,
      }).start(() => {
        // Step 2: Change the text **AFTER** fading out
        setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);

        // Step 3: Fade In after text change
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200, // Fade-in duration
          useNativeDriver: true,
        }).start();
      });
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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



  // Fetch address when component mounts
  useEffect(() => {
    console.log(selectedAddress, "seljf");

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
            selectedAddress={selectedAddress}
            setShowOverlay={setShowOverlay}
            setShowBasket={setShowBasket}
            setShowConfirm={setShowConfirm}
            navigation={navigation}
          />
        </View>
        <View style={{ width: screenWidth }}>
          <Subscription
            screenWidth={screenWidth}
            cartSubItems={cartSubItems}
            total={calculateTotalPrice(cartSubItems)}
            selectedAddress={selectedAddress}
          />
        </View>
      </Animated.View>

      {showOverlay && (
        <View style={styles.overlay}>

          {/* First Block - Basket Animation */}
          {showBasket && (
            <View style={styles.animationContainer}>
              <LottieView
                source={require("../../images/basket.json")} // Your JSON file
                autoPlay
                loop
                speed={1.5}
                style={{ width: 300, height: 300 }} // Adjust size
              />
              <Animated.Text style={[styles.text, { opacity }]}>
                {textArray[textIndex]}
              </Animated.Text>
            </View>
          )}

          {/* Second Block - Confirm Animation */}
          {showConfirm && (
            <View style={styles.animationContainer}>
              <LottieView
                source={require("../../images/confirm.json")} // Your second JSON file
                autoPlay
                loop
                speed={1.5}
                style={{ width: 300, height: 300 }} // Adjust size
              />
              <View style={styles.textContainer}>
                <Text style={styles.centeredText}>Order has been placed!!☺️🎉</Text>
              </View>
            </View>
          )}

        </View>
      )}


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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(255, 253, 253)", // Slight transparency
    paddingBottom: 0, // REMOVE padding
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20, // Space between both animations
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(118, 118, 118)",
    textAlign: "center",
    marginTop: 10,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // Space from animation
  },
  centeredText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(118,118,118)",
    textAlign: "center",
  },
});
