import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Button, ToastAndroid } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomDialog from '../../components/CustomDialog';
import BottomSheet from '../../components/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_CART, SET_DATES, SET_START_DATE, SET_SUBSCRIPTION_TYPE, RESET_ITEM } from '../../redux/cartSubSlice';


export const SubscriptionPlanScreen = ({ route, navigation }) => {
    const [item, setItem] = useState({});
    useEffect(() => {
        if (route.params?.item) {
            setItem(route.params.item);
        }
    }, [route.params.item]);

    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedDates, setSelectedDates] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bottomSheetContent, setBottomSheetContent] = useState('');
    const [bottomSheetView, setBottomSheetView] = useState('initial'); // 'initial' or 'new'

    // State to manage the quantity of the product
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartSub.items || []);
    const cartItem = cartItems.find(cartItem => cartItem._id === item._id);
    console.log(JSON.stringify(cartItem, 2, null) + " k");

    const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 0);
    //  const cartSubData = useSelector(state => state.cartSub); // Access cartSubSlice data

    console.log("Cart Sub Slice Data:::::", cartItems); // Print in console

    const increment = () => {
        setQuantity(prev => {
            const newQuantity = prev + 1;

            // Only update Redux if subscription type is already selected
            if (selectedPlan) {
                dispatch(ADD_TO_CART({ ...item, quantity: newQuantity }));
            }

            return newQuantity;
        });
    };

    const decrement = () => {
        setQuantity(prev => {
            if (prev > 0) {
                const newQuantity = prev - 1;

                // Only update Redux if subscription type is already selected
                if (selectedPlan) {
                    dispatch(ADD_TO_CART({ ...item, quantity: newQuantity }));
                }

                return newQuantity;
            }
            return prev;
        });
    };


    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity); // Update the quantity from the Redux store
        }
    }, [cartItem]);

    useEffect(() => {
        console.log(cartItem + " kknnnnnnn,");

        if (cartItem && cartItem._id === item._id) {
            setSelectedPlan(cartItem.subscriptionType);
            addSelectedDates(cartItem.subscriptionType, cartItem.dates, cartItem.startDate);
        }


    }, [cartItem]);

    const totalPrice = quantity * item.price;
    const plans = ['Daily', 'Weekly', 'Monthly', 'Alternate days'];

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
        const today = new Date().toISOString().split('T')[0]; // Get today's date as string

        if (day.dateString < today) {
            return;
        }
        const updatedDates = { ...selectedDates };

        if (updatedDates[day.dateString]) {
            delete updatedDates[day.dateString];
            updateDates(day, updatedDates, selectedPlan, "remove");
        } else {
            updatedDates[day.dateString] = { selected: true };
            updateDates(day, updatedDates, selectedPlan, "add");
        }
        setSelectedDates(updatedDates);
        //console.log(selectedDates);

    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setSelectedDates({});
        //console.log(selectedDates);

    };

    function getFirstDate(dates) {
        const dateKeys = Object.keys(dates)
            .filter(date => dates[date].selected) // Filter only selected dates
            .sort((a, b) => new Date(a) - new Date(b)); // Sort by date
        return dateKeys[0]; // Return the first date
    }

    const isSelectedDatesEmpty = (selectedDates) => {
        // Check if it's null, empty, or no dates are selected
        return !selectedDates || Object.keys(selectedDates).length === 0 || !Object.values(selectedDates).some(date => date.selected);
    };
    

    const handleNextClick = () => {
        if (quantity > 0) {
            if (!selectedPlan) {
                ToastAndroid.show("Please select a plan.", ToastAndroid.SHORT);
            } else {
                console.log(selectedDates, "selectedDates.length");
                
                if (isSelectedDatesEmpty(selectedDates)) {
                    ToastAndroid.show("Please select a start date.", ToastAndroid.SHORT); // Prompt to select a date
                } else {

                // Show the dialog to confirm the action
                setDialogMessage(generateDeliverySentence(
                    getSelectedDatesByType(selectedDates, selectedPlan),
                    selectedPlan,
                    getFirstDate(selectedDates)
                ));
                setDialogVisible(true);
            }


        }
        } else {
            ToastAndroid.show("Add items to proceed.", ToastAndroid.SHORT);
        }
    
        function getSelectedDatesByType(dates, type) {
            console.log(type);
    
            const selectedDates = Object.keys(dates)
                .filter(date => dates[date].selected)
                .map(date => new Date(date));
    
            if (type === 'Monthly') {
                return [...new Set(selectedDates.map(date => date.getDate()))];
            } else if (type === 'Weekly') {
                return extractUniqueWeekdays([...new Set(selectedDates.map(date =>
                    date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                ))]);
            } else {
                return [];
            }
        }
    };
    


    const getNextMonthDates = (data) => {
        // Convert keys to an array and sort them to find the first date
        const sortedDates = Object.keys(data).sort();

        if (sortedDates.length === 0) return [];

        // Get the first date and extract the month & year
        const firstDate = new Date(sortedDates[0]);
        const firstMonth = firstDate.getMonth();
        const firstYear = firstDate.getFullYear();

        // Find the next month
        let nextMonth = firstMonth + 1;
        let nextYear = firstYear;
        if (nextMonth > 11) { // If December, roll over to next year
            nextMonth = 0;
            nextYear += 1;
        }

        // Filter and extract day values for the next month
        const nextMonthDates = sortedDates
            .filter(date => {
                const d = new Date(date);
                return d.getMonth() === nextMonth && d.getFullYear() === nextYear;
            })
            .map(date => new Date(date).getDate()); // Extract only the day

        return nextMonthDates;
    };

    const getNextWeekDays = (data) => {
        // Convert keys to an array and sort them to find the first date
        const sortedDates = Object.keys(data).sort();

        if (sortedDates.length === 0) return [];

        // Get the first date
        const firstDate = new Date(sortedDates[0]);

        // Calculate the start and end of the next week
        const nextWeekStart = new Date(firstDate);
        nextWeekStart.setDate(firstDate.getDate() + 7); // Move 7 days forward

        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // End of the next week

        // Filter and extract weekday values for the next week
        const nextWeekDays = sortedDates
            .filter(dateStr => {
                const date = new Date(dateStr);
                return date >= nextWeekStart && date <= nextWeekEnd;
            })
            .map(dateStr => {
                const date = new Date(dateStr);
                return date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday (0) to 7
            });

        return nextWeekDays;
    };

    const addSelectedDates = (subscriptionType, datesArray, startDate) => {
        const newSelectedDates = { ...selectedDates }; // Copy existing selectedDates to avoid direct mutation

        // Helper function to format date as 'YYYY-MM-DD'
        const formatDate = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        // Logic based on subscription type
        const addWeeklyDates = (startDate, datesArray) => {
            const start = new Date(startDate);
            const endDate = new Date(start);
            endDate.setFullYear(endDate.getFullYear() + 5); // 5-year range

            // Function to find the next occurrence of a given weekday (1 = Monday, ..., 7 = Sunday)
            const getNextWeekdayDate = (currentDate, targetWeekday) => {
                const date = new Date(currentDate);
                const currentWeekday = date.getDay(); // JS: 0 = Sunday, 6 = Saturday

                // Convert 1-7 (Monday-Sunday) to JavaScript's 0-6 format
                const jsWeekday = targetWeekday % 7;

                let diff = jsWeekday - currentWeekday;
                if (diff <= 0) diff += 7; // Move to the next week if needed

                date.setDate(date.getDate() + diff);
                return date;
            };

            // Loop to generate dates for 5 years
            let currentDate = new Date(start);
            while (currentDate <= endDate) {
                datesArray.forEach(weekday => {
                    let nextDate = getNextWeekdayDate(currentDate, weekday);

                    while (nextDate <= endDate) {
                        const formattedDate = formatDate(nextDate);
                        newSelectedDates[formattedDate] = { selected: true };

                        // Move to the next occurrence (next week)
                        nextDate.setDate(nextDate.getDate() + 7);
                    }
                });

                // Move to the next month
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            newSelectedDates[formatDate(startDate)] = { selected: true };
        };




        const addMonthlyDates = (startDate, datesArray) => {
            const start = new Date(startDate);
            let counter = 0;
            // Loop for 5 years (or your desired duration)
            while (counter < 5 * 12) {  // 5 years * 12 months
                datesArray.forEach(date => {
                    const currentDate = new Date(start);
                    currentDate.setMonth(start.getMonth() + counter); // Add 1 month each time
                    currentDate.setDate(date); // Set the specific day in the month
                    const formattedDate = formatDate(currentDate);
                    newSelectedDates[formattedDate] = { selected: true };
                });
                counter++;
            }
        };

        const addDailyDates = (startDate) => {
            const start = new Date(startDate);
            // Loop for 5 years (or your desired duration)
            let counter = 0;
            while (counter < 5 * 365) { // 5 years * 365 days
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + counter); // Add 1 day each time
                const formattedDate = formatDate(currentDate);
                newSelectedDates[formattedDate] = { selected: true };
                counter++;
            }
        };

        const addAlternatingDates = (startDate) => {
            const start = new Date(startDate);
            // Loop for 5 years (or your desired duration)
            let counter = 0;
            while (counter < 5 * 365) { // 5 years * 365 days
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + counter); // Add 1 day each time
                const formattedDate = formatDate(currentDate);
                newSelectedDates[formattedDate] = { selected: true };
                counter += 2;
            }
        };

        // Select dates based on subscription type
        if (subscriptionType === 'Weekly') {
            addWeeklyDates(startDate, datesArray);
        } else if (subscriptionType === 'Monthly') {
            addMonthlyDates(startDate, datesArray);
        } else if (subscriptionType === 'Daily') {
            addDailyDates(startDate);
        } else if (subscriptionType === 'Alternate days') {
            addAlternatingDates(startDate, datesArray);
        }

        // Update the state with the new selected dates
        setSelectedDates(newSelectedDates);
    };

    const updateDates = (day, updatedDates, selectedPlan, action) => {
        const today = new Date(day.timestamp);

        const planHandlers = {
            Weekly: () => {
                for (let i = 0; i < 55; i++) {
                    const date = new Date(today.getTime() + i * 7 * 24 * 60 * 60 * 1000);
                    const dateString = date.toISOString().split('T')[0];
                    action === "add" ? updatedDates[dateString] = { selected: true } : delete updatedDates[dateString];
                }
            },
            Monthly: () => {
                for (let i = 0; i < 12; i++) {
                    const futureMonth = new Date(today);
                    futureMonth.setMonth(today.getMonth() + i);
                    const dateString = futureMonth.toISOString().split('T')[0];
                    action === "add" ? updatedDates[dateString] = { selected: true } : delete updatedDates[dateString];
                }
            },
            "Alternate days": () => {
                //console.log(selectedDates);
                setSelectedDates({})
                // updatedDates = {};
                //console.log(selectedDates);

                for (let i = 0; i < 365; i += 2) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dateString = date.toISOString().split('T')[0];
                    action === "add" ? updatedDates[dateString] = { selected: true } : delete updatedDates[dateString];
                }
            },
            Daily: () => {
                for (let i = 0; i < 365; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dateString = date.toISOString().split('T')[0];
                    action === "add" ? updatedDates[dateString] = { selected: true } : delete updatedDates[dateString];
                }
            }
        };

        if (planHandlers[selectedPlan]) {
            planHandlers[selectedPlan]();
        }
    };

    function extractUniqueWeekdays(dateStrings) {
        return [
            ...new Set(
                dateStrings.map(dateString =>
                    dateString.split(",")[0].trim().toLowerCase() // Extract weekday part and convert to lowercase
                )
            )
        ];
    }

    // Function to generate the delivery sentence
    function generateDeliverySentence(selectedDates, selectedType, startDate) {
        // Helper function to format date
        function formatDate(date) {
            const options = { day: 'numeric', month: 'long' };
            return new Date(date).toLocaleDateString('en-US', options);
        }

        // Handle different types of schedules
        if (selectedType === 'Monthly') {
            3
            const formattedDates = selectedDates
                .sort((a, b) => a - b) // Sort dates in ascending order
                .map(date => `${date}${getOrdinalSuffix(date)}`) // Format dates
                .join(', ');
            return item.weight + ` x ` + quantity + ` of ` + item.name + ` will be delivered on the ${formattedDates} of every month starting from ${formatDate(startDate)}.`;
        } else if (selectedType === 'Weekly') {
            const daysOfWeek = selectedDates.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(' and ');
            return item.weight + ` x ` + quantity + ` of ` + item.name + ` will be delivered on every ${daysOfWeek} of the week starting from ${formatDate(startDate)}.`;
        } else if (selectedType === 'Daily') {
            return item.weight + ` x ` + quantity + ` of ` + item.name + ` will be delivered every day starting from ${formatDate(startDate)}.`;
        } else if (selectedType === 'Alternate days') {
            return item.weight + ` x ` + quantity + ` of ` + item.name + ` will be delivered on alternate days starting from ${formatDate(startDate)}.`;
        } else {
            return 'Invalid schedule type.';
        }
    }

    // Helper function to get the ordinal suffix for a number
    function getOrdinalSuffix(number) {
        const j = number % 10,
            k = number % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }

    const handleDialogConfirm = () => {
        // Perform the saving work only after confirmation
        dispatch(RESET_ITEM({ _id: item._id }));
        dispatch(ADD_TO_CART({ ...item, quantity }));
        dispatch(SET_START_DATE({ _id: item._id, startDate: getFirstDate(selectedDates) }));
        dispatch(SET_SUBSCRIPTION_TYPE({ _id: item._id, subscriptionType: selectedPlan }));
    
        // Handle saving the selected dates based on plan
        if (selectedPlan === 'Daily' || selectedPlan === 'Alternate days') {
            dispatch(SET_DATES({ _id: item._id, dates: [0] }));
        } else if (selectedPlan === 'Monthly') {
            dispatch(SET_DATES({ _id: item._id, dates: getNextMonthDates(selectedDates) }));
        } else if (selectedPlan === 'Weekly') {
            dispatch(SET_DATES({ _id: item._id, dates: getNextWeekDays(selectedDates) }));
        }
    
        // Close the dialog after confirming
        setDialogVisible(false);
        ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
        navigation.goBack(); // Go back to the previous screen
    };
    

    return (
        <ScrollView style={styles.container}>
            {/* Product Information */}
            <View style={styles.productContainer}>
                <Image
                    source={{ uri: item.banner }} // Replace with your image URL
                    style={styles.productImage}
                />
                <View style={styles.productDetails}>
                    <Text style={styles.productTitle}>{item.name}</Text>
                    <Text style={styles.productSize}>{item.weight}</Text>
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                    <Text style={styles.productInclusive}>(Inclusive of all taxes)</Text>
                    <Text style={styles.subscribeNow}>Subscribe now!</Text>
                    <Text style={styles.priceNote}>
                        *Price of products on subscription may change as per market changes
                    </Text>
                </View>
                {/* Increment/Decrement Buttons */}
                <View style={styles.parentContainer}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={decrement}>
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={increment}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={[styles.totalContainer, { marginTop: 55 }]}>
                        <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
                    </View>

                    {/* Total Price */}
                    {/* */}


                </View>
            </View>

            {/* Select Plan Type */}
            <View style={styles.planContainer}>
                <Text style={styles.planHeading}>Select your plan type</Text>
                <View style={styles.planOptions}>
                    {plans.map((plan, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.planButton,
                                selectedPlan === plan && styles.planButtonSelected,
                            ]}
                            onPress={() => handlePlanSelect(plan)} // Updated logic here
                        >
                            <Text
                                style={[
                                    styles.planText,
                                    selectedPlan === plan && styles.planTextSelected,
                                ]}
                            >
                                {plan}
                            </Text>
                        </TouchableOpacity>

                    ))}
                </View>
            </View>

            {/* Calendar Section */}
            {(selectedPlan === 'Daily' || selectedPlan === 'Monthly' || selectedPlan === 'Weekly' ||
                selectedPlan === 'Alternate days' || selectedPlan === 'Custom Dates') && (
                    <>
                        <View style={styles.calendarContainer}>
                            <Text style={styles.calendarHeading}>Select Days</Text>
                            <Calendar
                                onDayPress={handleDayPress}
                                markedDates={{
                                    ...selectedDates,
                                    ...getDisabledPastDates(),
                                }}
                                markingType={'multi-dot'}
                                theme={{
                                    selectedDayBackgroundColor: '#9ECFFF',
                                    todayTextColor: '#FFB100',
                                    arrowColor: '#FFB100',
                                }}
                            />
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity style={styles.nextButton} onPress={() => handleNextClick()}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    </>
                )}

            <CustomDialog
                visible={dialogVisible}
                message={dialogMessage}
                onConfirm={handleDialogConfirm}  // Perform saving and closing dialog
                onCancel={() => setDialogVisible(false)}  // Just close the dialog
            />
            <BottomSheet
                isVisible={bottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                content={
                    bottomSheetView === 'initial' ? (
                        <View style={[styles.sheetContent, { flex: 1, justifyContent: 'space-between' }]}>
                            <Text style={styles.heading}>Select Quantity</Text>
                            <View style={styles.productContainer}>
                                <Image
                                    source={{ uri: item.image }} // Replace with your image URL
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productTitle}>{item.name}</Text>
                                    <Text style={styles.productSize}>{item.size}</Text>
                                    <Text style={styles.productPrice}>₹{item.price}</Text>
                                    <Text style={styles.productInclusive}>(Inclusive of all taxes)</Text>

                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.nextButton, { marginBottom: 0 }]}
                                onPress={() => {
                                    setBottomSheetView('new'); // Reset the bottom sheet view
                                }}
                            >
                                <Text style={styles.nextButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>


                    ) : (
                        <View style={[styles.sheetContent, { flex: 1 }]}>
                            <Text style={styles.heading}>Confirm Subscription</Text>
                            <View style={styles.bodyContent}>
                                <Text>{bottomSheetContent}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.nextButton, { marginBottom: 0 }]}
                                onPress={() => {
                                    setBottomSheetVisible(false);
                                    setBottomSheetView('initial'); // Reset the bottom sheet view
                                }}
                            >
                                <Text style={styles.nextButtonText}>Add to the cart</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'column', // Stack views vertically
        alignItems: 'center',    // Center align the content horizontally
        marginTop: 10,           // Add some spacing from the top
    },
    totalContainer: {
        alignItems: 'center', // Align total in the center
        marginTop: 10, // Add spacing below the buttons
    },
    totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    // Modify the buttonsContainer to stack properly
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginBottom: 10,
    },
    bodyContent: {
        flex: 1, // Take available space
        justifyContent: 'center', // Center the content
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 10,
        marginBottom: 20, // Added for spacing consistency
    },
    newContentText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
        marginTop: 10, // Included from duplicate class
    },
    continueButton: {
        backgroundColor: '#FFB100',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center',
        width: '100%',
    },
    continueButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    productContainer: {
        flexDirection: 'row',
        margin: 15,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    productSize: {
        fontSize: 14,
        color: '#444',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 5,
    },
    productInclusive: {
        fontSize: 12,
        color: '#666',
        marginTop: 3,
    },
    subscribeNow: {
        color: '#FFB100',
        fontWeight: 'bold',
        marginTop: 5,
    },
    priceNote: {
        fontSize: 12,
        color: '#FFA500',
        marginTop: 5,
    },
    planContainer: {
        margin: 15,
    },
    planHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    planOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
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
    calendarContainer: {
        marginHorizontal: 15,
        marginBottom: 20,
    },
    calendarHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    nextButton: {
        backgroundColor: '#FFB100',
        paddingVertical: 12,
        marginHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFB100', // Background for the entire container
        borderRadius: 9, // Rounded corners for the container
        paddingHorizontal: 15, // Horizontal padding inside the container
        paddingVertical: 5, // Vertical padding inside the container
        alignSelf: 'flex-start', // Adjust width to fit content
    },
    quantityButton: {
        width: 10, // Fixed width for buttons
        height: 26, // Fixed height for buttons
        backgroundColor: '#FFB100', // Same as container for seamless look
        borderRadius: 8, // Subtle rounded corners
        alignItems: 'center', // Center the text horizontally
        justifyContent: 'center', // Center the text vertically
    },
    buttonText: {
        fontSize: 20, // Larger text for visibility
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for contrast
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for consistency
        marginHorizontal: 10, // Space between quantity and buttons
    },

});

