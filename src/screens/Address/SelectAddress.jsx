import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStateStore } from '../../config';
import { useDispatch } from 'react-redux';
import { setSelectedAddress } from '../../redux/addressSlice';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SelectAddress = ({ isVisible, setIsVisible }) => {
  const navigation = useNavigation();
  const { currentUser } = useSelector(state => state.user);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isVisible) {
      fetchSavedAddresses();
    }
  }, [isVisible]);


  const changeSavedAddress = (address) => {
    console.log("dekh bhaiiiiii", address);
    
    dispatch(setSelectedAddress(address))
    setIsVisible(false)
  };
  const fetchSavedAddresses = async () => {
    try {
      const addresses = await AsyncStorage.getItem('addresses');
      if (addresses) {
        console.log("addresses999999", addresses);
        
        setSavedAddresses(JSON.parse(addresses));
      } else {
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  const capitalizeFirstLetter = str =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={[styles.container, { height: SCREEN_HEIGHT * 0.6 }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select Address</Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => {
            setIsVisible(false);
            navigation.navigate('AddAddress');
          }}>
          <Text style={styles.addAddressText}>+ Add new address</Text>
        </TouchableOpacity>

        {/* Saved Addresses */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 30 }}>
          {savedAddresses.length === 0 ? (
            <Text style={styles.noAddressText}>No saved addresses found.</Text>
          ) : (
            savedAddresses.map((address, index) => (
              <TouchableOpacity
                key={index}
                style={styles.addressContainer}
                onPress={() => {
                  changeSavedAddress(address);
                }}>
                <View style={styles.iconContainer}>
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressType}>
                    {capitalizeFirstLetter(address.type)}
                  </Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {address.completeAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    paddingBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  addAddressButton: {
    paddingVertical: 10,
  },
  addAddressText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noAddressText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    backgroundColor: '#00000020',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 12,
  },
  addressType: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  addressText: {
    textAlign: 'left',
    color: 'black',
    opacity: 0.8,
  },
});

