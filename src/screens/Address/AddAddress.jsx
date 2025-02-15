import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, PermissionsAndroid, Platform, Alert, ActivityIndicator, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import BottomSheet from '../../components/BottomSheet';
import { XMarkIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance_cust } from '../../config';
import { AppStateStore } from '../../config';
import { useDispatch } from 'react-redux';
import { setSelectedAddress } from '../../redux/addressSlice';

export const AddAddress = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    houseNumber: "",
    floor: "",
    towerBlock: "",
    landmark: "",
    name: "",
    phone: "",
  });

  const fields = [
    { key: "houseNumber", placeholder: "House number *" },
    { key: "floor", placeholder: "Floor *" },
    { key: "towerBlock", placeholder: "Tower / Block (optional)" },
    { key: "landmark", placeholder: "Nearby landmark (optional)" },
    { key: "name", placeholder: "Your name *" },
    { key: "phone", placeholder: "Your phone number (optional)", keyboardType: "phone-pad" },
  ];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const [selectedType, setSelectedType] = useState("Restaurant");
  const [location, setLocation] = useState(null); // Map region
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState('Fetching address...'); // Address state
  const mapRef = useRef(null); // Ref for MapView to access its methods
  const latitudeDelta = 0.002;
  const longitudeDelta = 0.002;
  const [showEnableLocationDialog, setShowEnableLocationDialog] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const defaultRegion = {
    latitude: 26.907552, // Example: San Francisco
    longitude: 75.805665,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010,
  };

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const navigation = useNavigation();

  useEffect(() => {

    handleCheckPressed()
  }, []);

  const handleCheckPressed = async () => {
    try {
      if (Platform.OS === 'android') {
        const checkEnabled = await isLocationEnabled();
        console.log('Location Enabled : ', checkEnabled);
        if (checkEnabled) {
          requestLocationPermission();
          console.log("hurray");
        } else {
          console.log("awwww");
          setIsLoading(false)
          setLocation(defaultRegion);
          fetchAddress(defaultRegion.latitude, defaultRegion.longitude);
          setShowEnableLocationDialog(true); // Show the dialog box when location is disabled
        }
      }
    } catch (error) {
      console.error('Error checking location status:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      } else {
        granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }

      if (granted === 'granted') {
        fetchCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to display the map.');
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Permission Error', 'Failed to request location permission.');
    }
  };

  const fetchCurrentLocation = () => {
    setIsLoading(true);

    // Step 1: Attempt to get cached location (maximumAge: 360000)
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        };
        console.log('Cached location:', region);

        setLocation(region);
        fetchAddress(region.latitude, region.longitude);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Cached location fetch error, retrying:', error);

        // Step 2: Attempt to get fresh location (maximumAge: 0)
        Geolocation.getCurrentPosition(
          (position) => {
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            };
            console.log('Fresh location:', region);

            setLocation(region);
            fetchAddress(region.latitude, region.longitude);
            setIsLoading(false);
          },
          (error) => {
            console.error('Fresh location fetch error:', error);
            Alert.alert(
              'Error',
              'Unable to fetch your location. Using default location.'
            );

            // Fallback to default location
            setLocation(defaultRegion);
            fetchAddress(defaultRegion.latitude, defaultRegion.longitude);
            setIsLoading(false);
            moveToCurrentLocation();
          },
          { enableHighAccuracy: falase, timeout: 10000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 360000 }
    );
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBpqxLiLZJ9stdf-WEmL04OVz4M_uOfvdU`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {

        setAddress(data.results[0].formatted_address); // Set the formatted address
        setLatitude(latitude);
        setLongitude(longitude);
      } else {
        setAddress('Unable to fetch address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    }
  };

  const moveToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        };
        // Animate to the location immediately
        mapRef.current?.animateToRegion(region, 1000);

        // Update the state for consistency
        setLocation(region);
      },
      (error) => {
        console.error('Error fetching current location:', error);
        Alert.alert('Error', 'Unable to fetch your location. Please try again.');
      },
      { enableHighAccuracy: false, timeout: 50000, maximumAge: 0 }
    );
  };

  const confirmLocation = () => {

    setBottomSheetVisible(true);
  };

  const handleRegionChangeComplete = (newRegion) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    }));
    fetchAddress(newRegion.latitude, newRegion.longitude);
  };

  const saveAddress = async () => {
    const addressString = Object.values(formData).join(", "); // Convert object values to a string
    console.log("Address String:", addressString);
    const userToken = await AsyncStorage.getItem('userToken');
    console.log(selectedType.toLocaleLowerCase());

    try {
      const response = await axiosInstance_cust.post(
        "/address",
        {
          type: selectedType.toLocaleLowerCase(),
          completeAddress: addressString,
          latitude,
          longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        const addressesString = await AsyncStorage.getItem("addresses");

        // Step 2: Parse it into a JavaScript array (if it's null, initialize as an empty array)
        let addresses = addressesString ? JSON.parse(addressesString) : [];

        // Step 3: Add a new JSON object (for example, an address object)
        const newAddress = {
          type: selectedType.toLocaleLowerCase(),
          completeAddress: addressString,
          latitude,
          longitude,
          isStored: true,
        };
        addresses.push(newAddress);

        // Step 4: Save the updated array  back to AsyncStorage
        await AsyncStorage.setItem("addresses", JSON.stringify(addresses));

        console.log("✅ User logged in successfully!");
        ToastAndroid.show('Address Saved ✅', ToastAndroid.SHORT);
        dispatch(setSelectedAddress(newAddress));
        navigation.goBack(); // Closes AddAddress
        setTimeout(() => navigation.navigate("Checkout"), 100);


      } else {
        console.log("⚠️ Unexpected response:", response.status);
      }
    } catch (error) {
      console.log(error + " login wala");
      //alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Map is loading, please wait...</Text>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a new area, locality..."
              value="Search for a new area, locality..."
              editable={false}
            />
          </View>
          <View style={styles.searchBar}>
            {showEnableLocationDialog && (
              <View style={styles.locationDialog}>
                <Text style={styles.dialogText}>
                  Location is disabled. Please enable location services to proceed.
                </Text>
                <TouchableOpacity
                  style={styles.enableButton}
                  onPress={() => {
                    setShowEnableLocationDialog(false); // Hide the dialog
                    // You can call a function to navigate to the location settings here
                  }}
                >
                  <Text style={styles.enableButtonText}>Enable</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Rest of your component */}
          </View>
          {/* Map View */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location} // Set the initial region only once
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={true}
            zoomEnabled={true}
            scrollEnabled={true}
            showsMyLocationButton={false}
            rotateEnabled={false} // Disable rotation for smoother interaction
            loadingEnabled={true}
          />

          {/* Fixed Marker */}
          <View style={styles.fixedMarker}>
            <Image
              source={require('../../images/pin.png')} // Replace with your marker icon
              style={styles.markerIcon}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={styles.myLocationButton} onPress={moveToCurrentLocation}>
            <Image
              source={require('../../images/aim.png')} // Replace with your icon
              style={styles.myLocationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.locationText}>Delivering your order to:</Text>
            <Text style={styles.locationDetails}>{address}</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
              <Text style={styles.confirmButtonText}>Use current location</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <BottomSheet
        isVisible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        content={
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container2}>
              {/* Top Header */}
              <View style={styles.header}>
                <Text style={styles.headerText}>Enter complete address</Text>
                <TouchableOpacity style={styles.crossIcon} onPress={() => setBottomSheetVisible(false)}  >
                  <XMarkIcon />
                </TouchableOpacity>
              </View>

              {/* Address Type Buttons */}
              <View style={styles.addressTypes}>
                {["Restaurant", "Hotel", "Cafe", "Other"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.addressTypeButton,
                      selectedType === type && styles.activeButton, // Highlight selected tab
                    ]}
                    onPress={() => {


                      setSelectedType(type)
                      console.log(selectedType);


                    }

                    } // Update state on click
                  >
                    <Text
                      style={[
                        styles.addressTypeText,
                        selectedType === type && styles.activeButtonText,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                {fields.map((field, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={field.placeholder}
                    keyboardType={field.keyboardType || "default"}
                    value={formData[field.key]}
                    onChangeText={(text) => handleInputChange(field.key, text)}
                  />
                ))}
              </View>
            </ScrollView>
            {/* Save Button */}
            <View style={styles.saveButtonView}>
              <TouchableOpacity style={styles.saveButton} onPress={() => saveAddress()}>
                <Text style={styles.saveButtonText}>Save address</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        heightCust="0.60"
      />

    </View>
  );
};

const styles = StyleSheet.create({

  container2: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 20, // Leave space for the fixed "Save address" button
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  crossIcon: {
    padding: 5,
  },
  addressTypes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#d1e7dd",
    borderColor: "#0f5132",
  },
  addressTypeText: {
    fontSize: 14,
    color: "#555",
  },
  activeButtonText: {
    color: "#0f5132",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
  },
  saveButtonView: {
    width: "100%", // Match the width of the parent View
    position: "absolute", // Keep it fixed at the bottom of the parent
    bottom: 0, // Align it at the bottom
    backgroundColor: "#fff", // Optional: background color to match the design
    padding: 0, // Optional: padding for the button
  },
  saveButton: {
    backgroundColor: "#28a745", // Customize button color
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 160, // Adjust based on footer height
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  myLocationIcon: {
    width: 30,
    height: 30,
  },
  container: { flex: 1 },
  map: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10, // Ensure it appears on top of the map
  },
  searchInput: {
    height: 40,
    color: 'grey',
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fixedMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // Adjust for icon size
    marginTop: -40, // Adjust for icon size
  },
  markerIcon: {
    width: 40,
    height: 40, // Adjust size to match the desired icon size
  },
  locationDialog: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  enableButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
