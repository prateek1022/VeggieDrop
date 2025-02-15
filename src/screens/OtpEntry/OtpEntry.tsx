import React, { useRef } from 'react';
import { Text, TextInput, StyleSheet, View, Image, SafeAreaView, TouchableOpacity, PixelRatio, StatusBar, ToastAndroid, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { axiosInstance } from '../../config';
import { Login } from '../Login/Login';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice';
import { useSelector } from "react-redux";
import { Home } from '../Home/Home';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

const styles = StyleSheet.create({
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
    marginTop: 40,
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
    marginTop: 80,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 50,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    textAlign: 'center',
    fontSize: 20,
  },


});

export const OtpEntry = ({ }) => {
  const route = useRoute();
  const { phoneNumber, confirmation } = route.params;
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  
  useEffect(() => {
    setPhone(phoneNumber)
    setConfirm(confirmation)
    console.log("Phone number received: ", phoneNumber); // Log the phone number passed from Login screen
    console.log("Confirmation object received: ", confirmation); // Log the confirmation object passed from Login screen
  }, [phoneNumber, confirmation]);

  console.log("ye lo phone "+phone);
  console.log("ye lo confirmation "+JSON.stringify(confirm, null, 2));
  
  

  const otpInputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  //const { currentUser } = useSelector((state: any) => state.user);
  //console.log(currentUser);
  const screenWidth = Dimensions.get('window').width;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleOtpChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }

  };

  const handleLogin = async () => {
    const otpCode = otp.join('');
  console.log("Entered OTP:", otpCode);
  try {
    // Verify the OTP using the confirmation object
    const userCredential = await confirm.confirm(otpCode);
    
    console.log("User signed in:", JSON.stringify(userCredential, null, 2));

    // On successful OTP verification, navigate to Home screen
    ToastAndroid.show("OTP Verified Successfully!", ToastAndroid.SHORT);
    await AsyncStorage.setItem('user', JSON.stringify(userCredential.user)); // Save user info

      // Update Redux store with user data
      dispatch(loginSuccess(userCredential.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],  // The 'Home' screen will be the only screen in the stack
      });

  } catch (error) {
    // In case of an error (invalid OTP or other issue), show an error toast
    console.log("Error verifying OTP:", error);
    ToastAndroid.show("Invalid OTP! Please try again.", ToastAndroid.SHORT);
  }
   

  };
  return (
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
          <Text style={styles.mainheading} > Enter OTP to continue</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => otpInputs.current[index] = ref}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                selectionColor="rgba(0, 0, 0, 0.1)"
                selectTextOnFocus={true}

                caretHidden={true}
                onChangeText={(text) => handleOtpChange(text, index)}

              />
            ))}
          </View>
          <TouchableOpacity
          onPress={() => {handleLogin()}}
             
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
  );
};
