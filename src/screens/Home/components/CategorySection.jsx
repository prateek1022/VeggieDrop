import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions,Alert,ToastAndroid} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'react-native';
import {CategoryData} from '../../../constants/CategoryData';
import {useNavigation} from '@react-navigation/native';
import {axiosInstance} from '../../../config';
import {Loader} from '../../../components/Loader';

export const CategorySection = () => {
  const screenWidth = Dimensions.get('screen').width;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  async function fetchCategories() {
    try {
      setLoading(true);
  
      const res = await axiosInstance.get('/get/categories');
  
      if (res?.data) {
        setData(res.data);
      } else {
        Alert.alert("Error", "Received an empty response from the server.");
      } 
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      
      Alert.alert(
        "Network Error",
        error.response?.data?.message || "Failed to fetch categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchCategories();
  }, []);
  

  const navigation = useNavigation();
  return (
    <>
      {loading ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Loader screenWidth={screenWidth} />
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{
            margin: 10,
            flexDirection: 'column',
          }}>
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Shop by Category
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
            }}> 
            {data?.map(item => {
              return (
                <TouchableOpacity
                  key={item?._id}
                  onPress={() => {
                    navigation.navigate('Category', {
                      category: item?.CategoryName,
                      id : item?._id 
                    });
                  }}>
                  <View
                    style={{
                      margin: 10,
                      height: 120,
                      width: 80,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#afeded',
                        borderRadius: 10,
                        height: 100,
                        width: 80,
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          height: 90,
                          width: '100%',
                          position: 'absolute',
                          bottom: 0,
                        }}
                        source={{uri: item.CategoryImage?.image_url}}
                      />
                    </View>
                    <Text
                      style={{
                        fontWeight: '900',
                        textAlign: 'center',
                        color: 'black',
                        textTransform:"capitalize"
                      }}>
                      {item?.CategoryName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};
