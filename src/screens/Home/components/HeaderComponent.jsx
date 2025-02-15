import React from 'react';
import { Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { styles } from '../Styles';
import { HeaderCards } from './HeaderCards';
import { SearchBar } from '../../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';

export const HeaderComponent = ({ headerData }) => {

  const navigation = useNavigation();

  return (
    <View style={styles.headComponent}>
      <View style={styles.top}>
        <View>
          <Text style={{ color: 'white', fontWeight: 'bold' }}> {headerData.isStored
            ? `Delivering To ${headerData.type.toUpperCase()}`
            : `Delivering In`}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>
            13 minutes
          </Text>
          <Text style={{ color: 'white', fontWeight: '400' }}>
            {(() => {
              const cleanedAddress = headerData.completeAddress
                .split(',')
                .map(part => part.trim())
                .filter(part => part)
                .join(', ');

              return cleanedAddress.length > 25
                ? `${cleanedAddress.substring(0, 25)}...`
                : cleanedAddress;
            })()}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Profile");
          }} >
            <Image source={require('../../../images/account.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar place={"Search in 'gifts'"} />
      <HeaderCards />
    </View>
  );
};
