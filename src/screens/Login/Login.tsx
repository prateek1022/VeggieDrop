import React from 'react';
import { Text, TextInput, StyleSheet, View, Image, SafeAreaView, TouchableOpacity, PixelRatio, StatusBar, ToastAndroid, Dimensions, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { axiosInstance_cust } from '../../config';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice';
import { useSelector } from "react-redux";
import { Home } from '../Home/Home';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

 

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,  // Ensures the modal is aligned to the bottom
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  otpText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "black"
  },
  submitButton: {
    height: 40,
    width: "80%",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#0d9903",
    marginTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffc421"
  },
  pic: {
    flex: 0.5,
    objectFit: "cover"
  },
  loginContainer: {
    flex: 0.5,
    backgroundColor: "white",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logo: {
    width: "20%",
    height: "20%",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
    objectFit: "contain",
    borderRadius: 10
  },
  input: {
    height: 40,
    margin: 12,
    width: "80%",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
  },
  mainheading: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
    fontSize: PixelRatio.getPixelSizeForLayoutSize(10),
    fontWeight: "bold",
    color: "black"
  },
  dusriheading: {
    fontWeight: "bold",
    color: "black"
  },
  button: {
    height: 40,
    width: "80%",
    borderRadius: 10,
    borderColor: "grey",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#0d9903",
    color: "white",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(2),
  }


});


export const Login = ({ }) => {
  const [confirm, setConfirm] = useState(null); 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const checkUserSession = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        // If user data exists, dispatch loginSuccess and navigate to Home
        const user = JSON.parse(userData);
        console.log(user);
        
        dispatch(loginSuccess(user));
        navigation.navigate('Home');
      }
    };

    checkUserSession();
  }, [dispatch, navigation]);
 


  async function getAddresses(token: string) {
   
    try {
      const response = await axiosInstance_cust.get(
        "/addresses",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const cleanedAddresses = response.data.map(({ _id, __v, ...rest }) => rest);


    try {
        await AsyncStorage.setItem("addresses", JSON.stringify(cleanedAddresses));
        console.log(JSON.stringify(cleanedAddresses));
        navigation.navigate("Home");
        console.log("✅ Addresses saved successfully!");
    } catch (error) {
        console.error("⚠️ Error saving addresses:", error);
    }
       // 
        
      } else {
        console.log("⚠️ Unexpected response:", response.status);
      }
    } catch (error) {
      console.log(error + " login walaaaaa");
      alert("Error", "Something went wrong");
    }
  }
  
  async function signinwithbackend(phoneNumber:string) {
    try {
      const response = await axiosInstance_cust.post(
        "/signup",
        { phone: phoneNumber },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    
      if (response.status === 200) {
        console.log("✅ User logged in successfully!");
        const { token } = response.data;
        await AsyncStorage.setItem("userPhone", phoneNumber);
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("addresses", JSON.stringify([]));
    
        console.log("✅ User logged in successfully!");
        getAddresses(token);
      } else {
        console.log("⚠️ Unexpected response:", response.status);
      }
    } catch (error) {
      console.log(error + " logiiin wala");
      alert("Error", "Something went wrong");
    }
  }


  // const handleLogin = async () => {
  //   ToastAndroid.show('This was clicked', ToastAndroid.SHORT);
  // };

  return (
    <>
      {
        
          <>
            <StatusBar backgroundColor='#ecfa23' barStyle={'dark-content'} />

            <SafeAreaView style={styles.container} >
              <Image style={styles.pic}
                source={{
                  uri: 'https://i.postimg.cc/Hkd3yCBN/bg.png',
                }}
              />
              <View style={styles.loginContainer} >
                <Image style={styles.logo} source={require("../../images/logo.png")} />
                <Text style={styles.mainheading} > India's last minute app </Text>
                <Text style={styles.dusriheading} >Login with phone</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(phone) => setPhone(phone)}
                  value={phone}
                  keyboardType="phone-pad"
                  placeholder="Enter Phone"
                />

                <TouchableOpacity
                  onPress={() => {signinwithbackend(phone)}}
                  style={styles.button}
                >
                  <Text style={
                    {
                      color: "white",
                      fontWeight: "bold",
                    }
                  } >Continue</Text>
                </TouchableOpacity>

              </View>
              <Text style={{
                backgroundColor: "#d3d3d3",
                fontSize: PixelRatio.getPixelSizeForLayoutSize(4),
                textAlign: "center",
                padding: 5
              }} > By continuing, you agree to our Terms of service & Privacy policy </Text>
            </SafeAreaView>

    
          </>
      }
    </>
  );
};
