import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, ToastAndroid } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomDialog from '../../components/CustomDialog';
import BottomSheet from '../../components/BottomSheet';
import { useDispatch } from 'react-redux';
import { ADD_TO_CART } from '../../redux/cartSlice';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal'; // Bottom Sheet
import Collapsible from 'react-native-collapsible';

export const Single_product = ({ route, navigation }) => {
  const [item, setItem] = useState({});
  useEffect(() => {
    setItem(route.params.item);
  }, []);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isShelfLifeExpanded, setShelfLifeExpanded] = useState(false);
  const [isOriginExpanded, setOriginExpanded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [bottomSheetContent, setBottomSheetContent] = useState('');
  const [bottomSheetView, setBottomSheetView] = useState('initial');

  const [selectedTab, setSelectedTab] = useState('');
  const [selectedDate, setSelectedDate] = useState({});
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const isItemInCart = cartItems.find(i => i._id === item._id);
  const itemQuantity = isItemInCart ? isItemInCart.quantity : 0;


  // State to manage the quantity of the product
  const [quantity, setQuantity] = useState(0);

  // Function to increment the quantity
  const increment = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Function to decrement the quantity (ensuring it's never less than 1)
  const decrement = () => {
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Calculate total price
  const totalPrice = quantity * item.regular_price;


  //setData(route.params)

  const product = {
    name: 'Amul Taaza Toned Milk Pouch',
    size: '1 ltr',
    price: '₹56',
    image: 'https://via.placeholder.com/300',
  };

  const relatedProducts = [
    { id: 1, name: 'Mother Dairy Toned Milk Pouch', size: '1 ltr', price: '₹56', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Amul Taaza Toned Milk Pouch', size: '500 ml', price: '₹28', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Amul Slim \'N\' Trim Double Toned', size: '500 ml', price: '₹25', image: 'https://via.placeholder.com/150' },
  ];

  const id = route.params.id;

  const pressContinueButton = () => {
    if (quantity > 0) {
      //setBottomSheetView('initial');
      setBottomSheetVisible(false) // Reset the bottom sheet view
      setTimeout(() => {
        const date = new Date(Object.keys(selectedDate));

        // Format the date
        const options = { day: 'numeric', month: 'long' }; // Specify day and month format
        const formattedDate = date.toLocaleDateString('en-GB', options);
        setDialogMessage(data.product_qty + ` x ` + quantity + ` of ` + data.productName + ` will be delivered on ${formattedDate} `)
        setDialogVisible(true);
      }, 1);
    }
    else {
      ToastAndroid.show("Add items to procced.", ToastAndroid.SHORT);
    }
  };

  const openSubscriptionPlanScreen = () => {
    navigation.navigate('SubscriptionPlanScreen', {
      item
    });
  };

  const openbottomsheet = () => {
    if (quantity > 0) {
      setBottomSheetVisible(true);
    }
    else {
      ToastAndroid.show("Add items to procced.", ToastAndroid.SHORT);

    }

  };

  const getDisabledPastDates = () => {
    const disabledDates = {};
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - i);
      const dateString = pastDate.toISOString().split('T')[0];

      if (dateString < today.toISOString().split('T')[0]) {
        disabledDates[dateString] = {
          disabled: true,
          disableTouchEvent: true,
          marked: false,
          dotColor: 'gray',
        };
      }
    }
    return disabledDates;
  };

  const handleDayPress = (day) => {
    const updatedDates = {}
    updatedDates[day.dateString] = { selected: true };
    setSelectedDate(updatedDates)
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Main Content */}
      <ScrollView style={styles.container}>
        {/* Product Image */}
        <Image source={{ uri: item.banner }} style={styles.productImage} />

        {/* Product Details */}
        <View style={styles.container2}>
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productSize}>{item.weight}</Text>
            <Text style={styles.productPrice}>₹{item.regular_price}</Text>
            <Text style={styles.taxText}>(Inclusive of all taxes)</Text>
          </View>

          <View style={styles.actionsContainer}>
            <View style={styles.quantityContainer}>
              {isItemInCart ? (
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      dispatch(ADD_TO_CART({ ...item, quantity: -1 }));
                    }}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{itemQuantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      dispatch(ADD_TO_CART({ ...item, quantity: 1 }));
                    }}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    dispatch(ADD_TO_CART({ ...item, quantity: 1 }));
                  }}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.totalPriceText}>Total: ₹{totalPrice}</Text>
          </View>


        </View>


        {/* Expandable Sections */}
        <TouchableOpacity onPress={() => setDescriptionExpanded(!isDescriptionExpanded)}>
          <Text style={styles.expandableHeader}>Product Description</Text>
        </TouchableOpacity>
        <Collapsible collapsed={!isDescriptionExpanded}>
          <Text style={styles.expandableContent}>
            Amul Taaza provides you with toned milk that is nutritious and perfect for daily consumption.
          </Text>
        </Collapsible>

        <TouchableOpacity onPress={() => setShelfLifeExpanded(!isShelfLifeExpanded)}>
          <Text style={styles.expandableHeader}>Shelf life</Text>
        </TouchableOpacity>
        <Collapsible collapsed={!isShelfLifeExpanded}>
          <Text style={styles.expandableContent}>7 Days</Text>
        </Collapsible>

        <TouchableOpacity onPress={() => setOriginExpanded(!isOriginExpanded)}>
          <Text style={styles.expandableHeader}>Country of origin</Text>
        </TouchableOpacity>
        <Collapsible collapsed={!isOriginExpanded}>
          <Text style={styles.expandableContent}>India</Text>
        </Collapsible>

        {/* Related Products */}
        <Text style={styles.relatedTitle}>Related Products</Text>
        <FlatList
          horizontal
          data={relatedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.relatedCard}>
              <Image source={{ uri: item.image }} style={styles.relatedImage} />
              <Text style={styles.relatedName}>{item.name}</Text>
              <Text style={styles.relatedSize}>{item.size}</Text>
              <Text style={styles.relatedPrice}>{item.price}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>

      {/* Bottom Subscribe Button */}
      {/* <TouchableOpacity style={styles.subscribeButton} onPress={() => setBottomSheetVisible(true)}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity> */}
      <View style={{ flexDirection: 'row', marginHorizontal: 0 }}>
        <TouchableOpacity style={[styles.subscribeButton, { flex: 1, marginRight: 0 }]} onPress={() => openSubscriptionPlanScreen()}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>

      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        isVisible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        content={
          // bottomSheetView === 'initial' ? (
          <View style={[styles.sheetContent]}>
            <Text style={styles.heading}>Select date</Text>
            {/* <View style={styles.planContainer}>
                <View style={styles.planOptions}>

                  <TouchableOpacity style={[styles.planButton, selectedTab == 'Tomorrow' && styles.planButtonSelected]} onPress={() => setSelectedTab('Tomorrow')} >
                    <Text style={[styles.planText, selectedTab == 'Tomorrow' && styles.planTextSelected]}>
                      Tomorrow
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.planButton, selectedTab == 'Select date' && styles.planButtonSelected]} onPress={() => setSelectedTab('Select date')} >
                    <Text style={[styles.planText, selectedTab == 'Select date' && styles.planTextSelected]}>
                      Select date
                    </Text>
                  </TouchableOpacity>
                </View>
                

              </View> */}

            <View style={styles.calendarContainer}>
              {/* <Text style={styles.calendarHeading}>Select Date</Text> */}
              <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                  ...selectedDate,
                  ...getDisabledPastDates(),
                }}
                markingType={'simple'}
                theme={{
                  selectedDayBackgroundColor: '#9ECFFF',
                  todayTextColor: '#FFB100',
                  arrowColor: '#FFB100',

                }}
                style={{
                  width: '80%', // Adjust the width as needed
                  // height: 400, // Adjust the height as needed
                  alignSelf: 'center', // Optional: Center the calendar horizontally
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.nextButton, { marginBottom: 0 }]}
              onPress={() => {
                pressContinueButton()
              }}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>


          // ) : (
          //   <View style={[styles.sheetContent, { flex: 1 }]}>
          //     <Text style={styles.heading}>Confirm Subscription</Text>
          //     <View style={styles.bodyContent}>
          //       <Text>{bottomSheetContent}</Text>
          //     </View>
          //     <TouchableOpacity
          //       style={[styles.nextButton, { marginBottom: 0 }]}
          //       onPress={() => {
          //         setBottomSheetVisible(false);
          //         setBottomSheetView('initial'); // Reset the bottom sheet view
          //       }}
          //     >
          //       <Text style={styles.nextButtonText}>Add to the cart</Text>
          //     </TouchableOpacity>
          //   </View>
          // )
        }
        heightCust="0.50"
      />
      <CustomDialog
        visible={dialogVisible}
        message={dialogMessage}
        onConfirm={() => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addButton: { // Replace with your desired border color
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFB100',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 23,
    paddingVertical: 3
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB100', // Replace with your desired text color
  },
  calendarContainer: {
    // height: 200
  },
  calendarHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    paddingRight: 50,
  },

  planContainer: {
    marginTop: 5, // Reduce the top margin
    marginBottom: 0, // Remove any bottom margin
  },
  planHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    margin: 0
  },
  planOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  planButton: {
    backgroundColor: '#E8F4FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  planButtonSelected: {
    backgroundColor: '#9ECFFF',
  },
  planText: {
    fontSize: 14,
    color: '#000',
  },
  planTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  detailsContainer: {
    flex: 2,
  },
  actionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 15, // Horizontal padding inside the container
    paddingVertical: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB100',
    borderRadius: 10,
  },
  quantityButton: {
    borderColor: '#000', // Replace with your desired border color
    borderRadius: 10,
    width: 34,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // Replace with your desired text color
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'right',
    marginTop: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  productSize: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taxText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  expandableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#f2f2f2',
    marginVertical: 2,
  },
  expandableContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
  },
  relatedCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
    width: 150,
    alignItems: 'center',
  },
  relatedImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  relatedName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  relatedSize: {
    fontSize: 12,
    color: '#555',
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#0078FF',
    padding: 15,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalButton: {
    backgroundColor: '#0078FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sheetContent: {
    flex: 1, // Ensure the sheet takes the full height
    justifyContent: 'space-between', // Distribute elements
    padding: 0,

  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,

  },
  productContainer2: {
    flexDirection: 'row',
    margin: 15,
  },
  productImage2: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
    marginBottom: 20, // Added for spacing consistency
  },
  productDetails2: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  productSize2: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  productPrice2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  productInclusive2: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  bodyContent: {
    flex: 1, // Take available space
    justifyContent: 'center', // Center the content
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFB100',
    paddingVertical: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 0,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',

  },


});
