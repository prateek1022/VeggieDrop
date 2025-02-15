import React from 'react';
import { View, Text, Image } from 'react-native';
import { QuantityButtonSub } from '../../components/QuantityButtonSub';

export const CartSubItems = ({ cartItems, screenWidth }) => {
  console.log(cartItems, 'cartItemssssssssssssssss');
  const getSubscriptionLine = (subscriptionType, dates, startDate) => {
    const dayMap = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      7: 'Sun'
    };
  
    const formatDate = (date) => {
      const options = { day: 'numeric', month: 'short' };
      const formattedDate = new Date(date).toLocaleDateString('en-US', options);
      return formattedDate;
    };
  
    switch (subscriptionType) {
      case 'Daily':
        return `Everyday starting from ${formatDate(startDate)}`;
      case 'Alternate days':
        return `Alternating days from ${formatDate(startDate)}`;
      case 'Weekly':
        const weekdays = dates.map(day => dayMap[day]).join(', ');
        return `Every ${weekdays} from ${formatDate(startDate)}`;
      case 'Monthly':
        const monthDates = dates.map(date => `${date}th`).join(', ');
        return `Every ${monthDates} of the month from ${formatDate(startDate)}`;
      default:
        return `Subscription details not available`;
    }
  };
  
  return (
    
    <View
      style={{
        backgroundColor: 'white',
        width: screenWidth * 0.95,
        height: 'auto',
        padding: 10,
        flexDirection: 'column',
        gap: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
          }}
          source={require('../../images/clock.png')}
        />
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: 20,
              textAlign: 'justify',
            }}>
            Bhai 30 minute me Phocha dunga
          </Text>
          <Text
            style={{
              fontWeight: 'normal',
            }}>
            Shipment of {cartItems.length} Items
          </Text>
        </View>
      </View>

      {cartItems.map(item => {
         const subscriptionLine = getSubscriptionLine(item.subscriptionType, item.dates, item.startDate);
        return (
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 5, // Reduced space between items
              borderBottomColor: '#E0E0E0',
              paddingBottom: 3,
              width: '100%', // Ensures the item container takes full width
            }}
            key={item._id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                width: '100%', // Ensure the row uses full width
              }}>
              <View
                style={{
                  height: 80, // Reduced image size
                  width: 80, // Reduced image size
                  borderWidth: 0.5,
                  borderColor: 'grey',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Image
                  style={{
                    height: 70, // Reduced height for image
                    width: 70, // Reduced width for image
                  }}
                  source={{ uri: item.banner }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: screenWidth * 0.4,
                  flexGrow: 1, // Allow the content to expand to full width
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
                <Text>{item.weight}</Text>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  ₹ {item.regular_price}
                </Text>

                {/* Static Line Below Regular Price (Inside the Item Container) */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', // This will allow text and button to be spaced
                    alignItems: 'center',
                    marginTop: 2, // Reduced space from price
                    paddingVertical: 2, // Smaller padding
                    borderRadius: 3,
                    width: '100%', // Ensures the line takes full available width
                  }}>
                  <Text
                    style={{
                      fontSize: 10, // Smaller font size
                      color: '#777', // Lighter text color
                      fontStyle: 'italic',
                      flex: 1, // Ensures it takes up remaining space
                      textAlign: 'left', // Align left
                    }}>
                    {subscriptionLine+" "}
                    <Text
                      style={{
                        fontSize: 10, // Smaller font size
                        color: '#007BFF', // Blue color for text
                        fontWeight: 'bold',
                      }}>
                      Edit
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={{ justifyContent: 'flex-end', marginLeft: 25 }}>
                <QuantityButtonSub item={item} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
