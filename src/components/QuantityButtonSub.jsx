import {React,useState} from 'react';
import {useDispatch} from 'react-redux';
import {ADD_TO_CART} from '../redux/cartSubSlice';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {MinusSmallIcon, PlusSmallIcon} from 'react-native-heroicons/solid';

export const QuantityButtonSub = ({item}) => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartSub.items);
  const isItemInCart = cartItems.find(i => i._id === item._id);
  //const itemQuantity = isItemInCart ? isItemInCart.quantity : 0;
  const screenWidth = Dimensions.get('window').width;
  const cartItem = cartItems.find(cartItem => cartItem._id === item._id);
   const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 0);

       const increment = () => {
           setQuantity(prev => {
               const newQuantity = prev + 1;
               dispatch(ADD_TO_CART({ ...item, quantity: newQuantity })); // ✅ Pass updated quantity
               return newQuantity;
           });
       };
       
       const decrement = () => {
           setQuantity(prev => {
               if (prev > 0) {
                   const newQuantity = prev - 1;
                   dispatch(ADD_TO_CART({ ...item, quantity: newQuantity })); // ✅ Pass updated quantity
                   return newQuantity;
               }
               return prev;
           });
       };

  return (
    <SafeAreaView style={{
      // width:screenWidth*0.5,
      // height:"max-content"
    }} >
      <View style={styles.container}>
        {isItemInCart ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                decrement();
              }}>
              <MinusSmallIcon size={10} color="white" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
               increment ();
              }}>
              <PlusSmallIcon size={10} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              dispatch(ADD_TO_CART({...item, quantity}));
            }}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#018f14',
    borderRadius: 5,
    paddingVertical:5,
    paddingHorizontal:0.5
  },
  iconButton: {
    padding: 5,
    borderRadius: 5,
  },
  quantityText: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  addButton: {
  //  backgroundColor: '#bbfcc0',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: '#008f15',
    borderWidth: 1,
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#008f15',
  },
});
