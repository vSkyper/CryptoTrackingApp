import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import tw from 'twrnc';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const CoinItem = ({
  id,
  name,
  symbol,
  current_price,
  price_change_percentage_24h,
  image,
}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={tw`flex flex-row justify-between p-4`}
      onPress={() => {
        navigation.navigate('Coin', {
          id,
        });
      }}>
      <View style={tw`flex flex-row items-center justify-center`}>
        <Image
          style={tw`h-8 w-8`}
          source={{
            uri: image,
          }}
        />
        <View style={tw`flex items-start justify-center`}>
          <Text style={tw`text-white ml-2`}>{name}</Text>
          <Text style={tw`text-gray-500 text-xs ml-2`}>
            {symbol.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={tw`flex items-end justify-center`}>
        <Text style={tw`text-white`}>
          $
          {parseFloat(current_price)
            .toFixed(8)
            .replace(/\.?0+$/, '')}
        </Text>
        <View style={tw`mt-1 flex flex-row items-center`}>
          <Text style={tw`text-white`}>24h: </Text>
          <Text
            style={tw.style({
              'text-red-500': price_change_percentage_24h < 0,
              'text-green-500': price_change_percentage_24h >= 0,
            })}>
            {parseFloat(price_change_percentage_24h).toFixed(2)}%
          </Text>
          {price_change_percentage_24h < 0 ? (
            <Svg
              style={tw`h-4 w-4 text-red-500`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <Path d="M13 17h8m0 0V9m0 8-8-8-4 4-6-6" />
            </Svg>
          ) : (
            <Svg
              style={tw`h-4 w-4 text-green-500`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <Path d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6" />
            </Svg>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default CoinItem;
