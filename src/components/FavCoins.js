import React, {useState, useEffect} from 'react';
import {View, FlatList, Text} from 'react-native';
import tw from 'twrnc';
import Svg, {Path} from 'react-native-svg';
import CoinItem from './CoinItem';
import {useNavigation} from '@react-navigation/native';
import realm from '../data/Database';

const FavCoins = () => {
  const navigation = useNavigation();

  const [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    let FavCoins = realm.objects('FavCoins');
    FavCoins = FavCoins.map(item => {
      return item.id;
    });

    const realmFilter = [
      Array(FavCoins.length)
        .fill()
        .map((x, i) => `id == $${i}`)
        .join(' OR '),
    ].concat(FavCoins);

    const CoinsInfo = realm.objects('CoinsInfo').filtered(...realmFilter);

    setFavoriteList(CoinsInfo);

    return () => {
      setFavoriteList([]);
    };
  }, [navigation]);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex flex-row items-center p-3`}>
        <Svg
          style={tw`h-7 w-7 text-gray-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onPress={() => navigation.goBack()}>
          <Path d="m10 19-7-7m0 0 7-7m-7 7h18" />
        </Svg>
      </View>
      {favoriteList.length !== 0 ? (
        <FlatList
          data={favoriteList}
          renderItem={({item}) => (
            <CoinItem
              id={item.id}
              name={item.name}
              symbol={item.symbol}
              current_price={item.current_price}
              price_change_percentage_24h={item.price_change_percentage_24h}
              image={item.image}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={10}
        />
      ) : (
        <View style={tw`flex items-center justify-center p-3`}>
          <Text style={tw`text-white text-lg font-semibold`}>
            You don't have any favorite coins :(
          </Text>
        </View>
      )}
    </View>
  );
};

export default FavCoins;
