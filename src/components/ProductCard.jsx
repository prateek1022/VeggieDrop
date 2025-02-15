import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/outline';
import { calendardays } from 'react-native-heroicons/outline';
import { QuantityButton } from './QuantityButton';
import { CalendarButton } from './CalendarButton';

export const ProductCard = ({ item, wishlist, onToggleWishlis, navigation, onPress }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if the product is in the wishlist
    setIsInWishlist(wishlist?.some((wishlistItem) => wishlistItem._id === item._id));
  }, [wishlist, item._id]);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <TouchableOpacity
          onPress={async () => {
            // Toggle the wishlist status and call the onToggleWishlist function
            console.log("calling.............");
            await onToggleWishlist(item._id);
            setIsInWishlist(!isInWishlist);
          }}
        >
          {isInWishlist ? (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../images/laldil.png')}
            />
          ) : (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../images/kaladil.png')}
            />
          )}
        </TouchableOpacity>
      </View>
      <Image style={styles.image} source={{ uri: item.banner }} />
      <View style={styles.infoContainer}>
        <View style={styles.timeContainer}>
          <ClockIcon color="black" size={15} />
          <Text style={styles.timeText}>19 MINS</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.weight, { flex: 1 }]}>{item.weight}</Text>

          <CalendarButton navigation={navigation} item={item} />

        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.regular_price}</Text>
          <QuantityButton item={item} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#bbfcc0',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: '#008f15',
    borderWidth: 1,
  },
  calendar_container: {
   // backgroundColor: '#bbfcc0',
    paddingVertical: 1.5,
    paddingHorizontal: 1.5,
    height: 26,
    width: 26,
    borderRadius: 5,
    //borderColor: '#008f15',
    borderColor: '#008f15',
    borderWidth: 1,
  },
  subscribenot: {
    height: 22,
    width: 22,
    resizeMode: 'contain'
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 15,
    width: '45%', // 45% width for responsiveness
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 100, // Adjust the height as needed
    width: '100%', // Take up 100% width
    objectFit: 'contain',
  },
  infoContainer: {
    padding: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e1dc',
    padding: 2,
    borderRadius: 5,
    marginBottom: 10,
  },
  timeText: {
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
  name: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'justify',
  },
  weight: {
    color: 'black',
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  price: {
    color: 'black',
    fontWeight: 'bold',
  },
});
