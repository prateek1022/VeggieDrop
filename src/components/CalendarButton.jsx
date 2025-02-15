import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export const CalendarButton = ({ navigation, item }) => {

    const cartItems = useSelector(state => state.cartSub.items);
    console.log(cartItems, "cartItems");
    const hasSubscription = cartItems.some(
        (i) => i._id === item._id && i.subscriptionType && i.subscriptionType.trim() !== ''
    );
    console.log(hasSubscription, "hasSubscription");


    return (
        <TouchableOpacity
            style={styles.calendar_container}
            onPress={() => {
                navigation.navigate('SubscriptionPlanScreen', { item });
            }}>
            <Image
                source={
                    hasSubscription
                        ? require('../images/calendar_yes.png')
                        : require('../images/calendar_no.png')
                }
                style={styles.subscribenot}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    calendar_container: {
        paddingVertical: 1.5,
        paddingHorizontal: 1.5,
        height: 26,
        width: 26,
        borderRadius: 5,
        borderColor: '#008f15',
        borderWidth: 1,
    },
    subscribenot: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
    },
});
