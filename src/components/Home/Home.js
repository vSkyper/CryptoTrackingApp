import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, Pressable, RefreshControl} from 'react-native';
import tw from 'twrnc';
import Svg, {Path} from 'react-native-svg';
import CoinItem from '../CoinItem';
import HomeGlobalData from './HomeGlobalData';
import {useNavigation} from '@react-navigation/native';
import realm from '../../data/Database';
import {fetchCoinsInfo} from '../../data/fetchData';

const Home = () => {
  const navigation = useNavigation();

  const [coinsInfo, setCoinsInfo] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const CoinsInfo = realm.objects('CoinsInfo');
    setCoinsInfo(CoinsInfo);

    return () => {
      setCoinsInfo([]);
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCoinsInfo().then(() => {
      const CoinsInfo = realm.objects('CoinsInfo');
      setCoinsInfo(CoinsInfo);
      setRefreshing(false);
    });
  }, []);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex flex-row items-center justify-between p-3`}>
        <View style={tw`flex flex-row items-center`}>
          <Svg
            style={tw`h-8 w-8 text-gray-500`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <Path d="m9 8 3 5m0 0 3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </Svg>
          <Text style={tw`text-xl text-white font-semibold ml-2`}>
            Cryptocurrency
          </Text>
        </View>
        <Pressable
          style={tw`flex flex-row items-center`}
          onPress={() => {
            navigation.navigate('FavCoins');
          }}>
          <Text style={tw`text-xl text-white font-semibold mr-1`}>Favs</Text>
          <Svg
            style={tw`h-8 w-8 text-yellow-500`}
            viewBox="0 0 20 20"
            fill="currentColor">
            <Path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
          </Svg>
        </Pressable>
      </View>
      <FlatList
        data={coinsInfo}
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
        ListHeaderComponent={HomeGlobalData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Home;
