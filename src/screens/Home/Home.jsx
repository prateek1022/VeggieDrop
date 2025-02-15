import React, { useState, useEffect } from 'react';
import {AppState, SafeAreaView, StatusBar, ScrollView, View, Text, StyleSheet, Dimensions, Alert, PermissionsAndroid, Platform, Linking } from 'react-native';
import { HeaderComponent } from './components/HeaderComponent';
import { Highlight } from './components/Highlight';
import { CategorySection } from './components/CategorySection';
import { Footer } from '../../components/Footer';
import { useSelector } from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { current } from '@reduxjs/toolkit';
import { setSelectedAddress } from '../../redux/addressSlice';
import { useDispatch } from 'react-redux';
//import { AppStateStore } from '../../config'; 
import App from '../../../App';
//import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');


export const Home = () => {


  const dispatch = useDispatch();
  const [place,setPlace] = useState("Home");
  const latitudeDelta = 0.002;
  const longitudeDelta = 0.002;
  const cartItems = useSelector(state => state.cart);
  const cartSubItems = useSelector(state => state.cartSub.items);
  const [isLoading, setIsLoading] = useState(true);
  const selectedAddress = useSelector((state) => state.address.selectedAddress); // Re-run when AppStateStore.selectedAddress1 changes
  const [headerData, setHeaderData] = useState({
    type: '',
    completeAddress: '',
    latitude: null,
    longitude: null,
  }); 

  useEffect(() => {
    if (selectedAddress) {
      
      setHeaderData({
        type: selectedAddress.type,
        completeAddress: selectedAddress.completeAddress,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
        isStored: selectedAddress.isStored,
      });
      setPlace("DELIVER TO " + selectedAddress.type + " IN");
    } 
    else{
      requestLocationPermission();
    }
  }, [selectedAddress]);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedAddress) { 
      setPlace("DELIVER TO " + selectedAddress.type + " IN");
      setHeaderData({
        type: selectedAddress.type,
        completeAddress: selectedAddress.completeAddress,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
        isStored: selectedAddress.isStored,
      });
      console.log("This ran successfully");
      console.log(selectedAddress);
      
    } 
    else{
      requestLocationPermission();
    }
    }, [selectedAddress])
  );

  useEffect(() => {
    const handleAppStateChange =  (nextAppState) => {
      if (nextAppState === "active") {
      //  console.log(AppStateStore.selectedAddress1, "selectedAddress1");
        if (selectedAddress) {
          setPlace("DELIVER TO " + selectedAddress.type + " IN");
          setHeaderData({
            type: selectedAddress.type,
            completeAddress: selectedAddress.completeAddress,
            latitude: selectedAddress.latitude,
            longitude: selectedAddress.longitude,
            isStored: selectedAddress.isStored,
          });
        } 
        else{
          requestLocationPermission();
        }
      }  
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove(); // Cleanup on unmount
  }, [selectedAddress]);

  const fetchSavedAddresses = async (lat, lng) => {
    try {
      const addresses = await AsyncStorage.getItem('addresses');
      const savedAddresses = JSON.parse(addresses);
  
      if (savedAddresses?.length > 0) {
        // If there are saved addresses, find the closest one
        const closestLocation = getClosestLocation(lat, lng, savedAddresses);
        const storedAddress = selectedAddress;
  
        if (storedAddress) {
          // If a stored address exists, set it as the header data
          setPlace("DELIVER TO " + storedAddress.type + " IN");
          setHeaderData({
            type: storedAddress.type,
            completeAddress: storedAddress.completeAddress,
            latitude: storedAddress.latitude,
            longitude: storedAddress.longitude,
            isStored: true,
          });
        } else if (closestLocation) {
          // If no stored address, use the closest saved location
          setPlace("DELIVER TO " + closestLocation.type + " IN");
          setHeaderData({
            type: closestLocation.type,
            completeAddress: closestLocation.completeAddress,
            latitude: closestLocation.latitude,
            longitude: closestLocation.longitude,
            isStored: true,
          });
          const newHeaderData = {
            type: closestLocation.type,
            completeAddress: closestLocation.completeAddress,
            latitude: closestLocation.latitude,
            longitude: closestLocation.longitude,
            isStored: true,
          };
          setTimeout(() => dispatch(setSelectedAddress(newHeaderData)), 100);
        } else {
          // If no stored or closest saved location, fetch address from coordinates
          const address = await fetchAddress(lat, lng);
          const newHeaderData = {
            type: "null",
            completeAddress: address,
            latitude: lat,
            longitude: lng,
            isStored: false,
          };
          setHeaderData(newHeaderData);
          setPlace("DELIVERING IN");  
          setTimeout(() => dispatch(setSelectedAddress(newHeaderData)), 100);
        }
      } else {
        // If no saved addresses exist, fetch address from coordinates
        const address = await fetchAddress(lat, lng);
        const newHeaderData = {
          type: "null",
          completeAddress: address,
          latitude: lat,
          longitude: lng,
          isStored: false,
        };
        setHeaderData(newHeaderData);
        setPlace("DELIVERING IN");  
        setTimeout(() => dispatch(setSelectedAddress(newHeaderData)), 100);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching saved addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  function getClosestLocation(currentLat, currentLng, addresses) {
    console.log('Current locationnnnnn:', currentLat, currentLng, addresses);
    console.log('Addresses:', addresses);
    

    function haversineDistance(lat1, lon1, lat2, lon2) {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371000; // Earth radius in meters

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    }

    for (let address of addresses) {
      const distance = haversineDistance(
        currentLat,
        currentLng,
        address.latitude,
        address.longitude
      );
      console.log("Distance:", distance);

      if (distance <= 20) {
        return address; // Return the first matching location
      }
    }

    return null; // No nearby location found
  }

  const requestLocationPermission = async (attempt = 1) => {
    try {
      const androidPermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const iosPermission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      const permission = Platform.OS === 'android' ? androidPermission : iosPermission;

      const alreadyGranted = Platform.OS === 'android'
        ? await PermissionsAndroid.check(permission)
        : await check(permission);

      if (alreadyGranted) return checkLocationEnabled();

      const granted = Platform.OS === 'android'
        ? await PermissionsAndroid.request(permission)
        : await request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === RESULTS.GRANTED) {
        return checkLocationEnabled();
      }

      if (attempt < 2) {
        return Alert.alert('Permission Needed', 'Location permission is required.', [
          { text: 'OK', onPress: () => requestLocationPermission(attempt + 1) }
        ]);
      } 

      Alert.alert('Permission Denied', 'Enable location in settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]);
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  const checkLocationEnabled = async () => {
    try {
      if (Platform.OS === 'android') {
        const checkEnabled = await isLocationEnabled();
        console.log('Location Enabled : ', checkEnabled);
        if (checkEnabled) {
          fetchCurrentLocation();
          console.log("hurray");
        } else {
          Alert.alert('Location disabled!', 'Enable location in settings.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS') }
          ]);
        }
      }
    } catch (error) {
      console.error('Error checking location status:', error);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBpqxLiLZJ9stdf-WEmL04OVz4M_uOfvdU`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        // Sort the results by the length of the formatted_address (longest first)
        const longestAddress = data.results
          .sort((a, b) => b.formatted_address.length - a.formatted_address.length)
          .shift(); // Get the longest address
        
        // Return the longest formatted address
        return longestAddress.formatted_address;
      } else {
        return "Unable to fetch complete address";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  const fetchCurrentLocation = (retryCount = 0) => {
    setIsLoading(true);
  
    const maxAges = [0, 5000, 15000]; // Try with increasing cache time
  
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: latitudeDelta, 
          longitudeDelta: longitudeDelta, 
        };
  
        console.log(`✅ Cached location (Retry: ${retryCount}):`, region);
        fetchSavedAddresses(lat, lng);
        
      },
      (error) => {
        console.warn(`⚠️ Cached location fetch error (Retry: ${retryCount}), retrying...`, error);
  
        // Retry with a higher maximumAge if available
        if (retryCount < maxAges.length - 1) {
          setTimeout(() => fetchCurrentLocation(retryCount + 1), 3000); // Retry after 3 seconds
        } else {
          console.warn("❌ Failed to fetch location after all retries");
          
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: maxAges[retryCount] }
    );
  };
  

  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        {/* Red Header */}
        <View style={styles.header}>
          <ShimmerPlaceholder shimmerColors={["#ffdddd", "#ffaaaa", "#ffdddd"]} style={styles.deliveryTime} />
          <ShimmerPlaceholder shimmerColors={["#ffdddd", "#ffaaaa", "#ffdddd"]} style={styles.address} />
          <ShimmerPlaceholder shimmerColors={["#ffdddd", "#ffaaaa", "#ffdddd"]} style={styles.profileIcon} />
        </View>

        {/* Search Bar */}
        <ShimmerPlaceholder style={styles.searchBar} shimmerColors={["#eee", "#ddd", "#eee"]} />

        {/* Category Section */}
        <View style={styles.categoryRow}>
          {[...Array(4)].map((_, index) => (
            <ShimmerPlaceholder key={index} style={styles.categoryItem} shimmerColors={["#eee", "#ddd", "#eee"]} />
          ))}
        </View>

        {/* Offer Banner */}
        <ShimmerPlaceholder style={styles.offerBanner} shimmerColors={["#eee", "#ddd", "#eee"]} />

        {/* Shop by Category */}
        <ShimmerPlaceholder style={styles.searchBar} shimmerColors={["#eee", "#ddd", "#eee"]} />

        <View style={styles.categoryGrid}>
          {[...Array(2)].map((_, index) => (
            <ShimmerPlaceholder key={index} style={styles.categoryBox} shimmerColors={["#eee", "#ddd", "#eee"]} />
          ))}
        </View>
        <View style={styles.categoryGrid}>
          {[...Array(2)].map((_, index) => (
            <ShimmerPlaceholder key={index} style={styles.categoryBox} shimmerColors={["#eee", "#ddd", "#eee"]} />
          ))}
        </View>

        {/* Free Delivery Banner */}
        <ShimmerPlaceholder style={styles.deliveryBanner} shimmerColors={["#eee", "#ddd", "#eee"]} />

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <ShimmerPlaceholder style={styles.itemCount} shimmerColors={["#eee", "#ddd", "#eee"]} />
          <ShimmerPlaceholder style={styles.nextButton} shimmerColors={["#018f14", "#0ba222", "#018f14"]} />
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#f01f1f" />
      <SafeAreaView style={{
        marginBottom: cartItems.length !== 0 ? 140 : 70
      }} >
        <ScrollView>
          <HeaderComponent headerData={headerData} />
          <Highlight />
          <CategorySection />
        </ScrollView>
      </SafeAreaView>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'red',
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryTime: {
    width: 120,
    height: 20,
    borderRadius: 5,
  },
  address: {
    width: 180,
    height: 15,
    borderRadius: 5,
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  searchBar: {
    width: width * 0.9,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryItem: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  offerBanner: {
    width: width * 0.9,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryBox: {
    width: width * 0.42,
    height: 100,
    borderRadius: 10,
  },
  deliveryBanner: {
    width: width * 0.9,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 30,
    backgroundColor: 'white',
  },
  itemCount: {
    width: 100,
    height: 40,
    borderRadius: 10,
  },
  nextButton: {
    width: 120,
    height: 40,
    borderRadius: 10,
  },
});
