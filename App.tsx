import React from 'react';
import { StatusBar } from 'react-native';
import type { PropsWithChildren } from 'react';
import { Login } from './src/screens/Login/Login';
import { OtpEntry } from './src/screens/OtpEntry/OtpEntry';
import { MainScr } from './src/screens/MainScr/MainScr';
import { CategoryProducts } from './src/screens/Category_products/CategoryProducts';
import { Home } from './src/screens/Home/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import { store } from './src/redux/store';
import { useSelector } from "react-redux";
import { Button, Image, Text, View } from 'react-native';
import {
  MagnifyingGlassIcon
} from 'react-native-heroicons/outline';
import { Checkout } from './src/screens/Checkout/Checkout';
import { AddAddress } from './src/screens/Address/AddAddress';
import { DeliveryScreen } from './src/screens/Delivery/DeliveryScreen';
import { Profile } from './src/screens/Profile/Profile';
import { OrderSummary } from './src/screens/OrderSummary/OrderSummary';
import { Single_product } from './src/screens/Single_product/Single_product';
import { SubscriptionPlanScreen } from './src/screens/SubscriptionPlanScreen/SubscriptionPlanScreen';
import { YourOrders } from './src/screens/YourOrders/YourOrders';
import { Search } from './src/screens/Search/Search';
import { Wishlist } from './src/screens/Wishlist/Wishlist';
import { pubKey } from './src/constants/environment';
import { RootStackParamList } from './navigation';


// import { PersistGate } from 'redux-persist/integration/react';

const Stack = createNativeStackNavigator<RootStackParamList>();
//console.log(pubKey+" efefefef")


function App(): JSX.Element {

  // const { currentUser } = useSelector((state: any) => state.user);

  return (
    <Provider store={store}>
     <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" // Set to a color matching your app's design
        translucent={false} 
      />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="MainScr" component={MainScr} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Category" component={CategoryProducts} options={({ route, navigation }) => ({
              title: route?.params?.category, headerTitleStyle: {
                fontSize: 20
              },
              headerRight: () => (
                <MagnifyingGlassIcon color="black" size="30" onPress={() => {
                  navigation.navigate('Search');
                }} />
              )
            })}
            />
            <Stack.Screen name="Checkout" component={Checkout} options={({ route }) => ({
              headerRight: () => (
                <View>
                  <Text style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: 15
                  }} >Share</Text>
                </View>
              )
            })} />
            <Stack.Screen name="AddAddress" component={AddAddress} />
            <Stack.Screen name="Delivery" component={DeliveryScreen} options={{ headerShown: false }}
            />
            <Stack.Screen name="Single_product" component={Single_product} options={({ route, navigation }) => ({
              title: route?.params?.productName, headerTitleStyle: {
                fontSize: 20
              }
            })}
            />

            <Stack.Screen name="SubscriptionPlanScreen" component={SubscriptionPlanScreen} options={({ route, navigation }) => ({
              title: "Subscribe", headerTitleStyle: {
                fontSize: 20
              }
            })}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="OtpEntry" component={OtpEntry} />
            <Stack.Screen name="YourOrders" component={YourOrders} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="OrderSummary" component={OrderSummary} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
     
    </Provider>
  );
}

export default App;
