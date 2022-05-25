import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import tw from 'twrnc';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import CoinChart from './CoinChart';
import realm from '../../data/Database';
import {fetchCoinInfo} from '../../data/fetchData';

const Coin = ({route}) => {
  const navigation = useNavigation();

  const {id} = route.params;

  const [data, setData] = useState({});
  const [days, setDays] = useState(7);

  const [isFav, setFav] = useState(false);

  useEffect(() => {
    fetchCoinInfo(id).then(res => {
      setData(res);
    });

    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    const FavCoins = realm.objects('FavCoins').filtered('id == $0', id);
    if (FavCoins.length !== 0) {
      setFav(true);
    } else {
      setFav(false);
    }

    return () => {
      setFav(false);
    };
  }, [id]);

  const modifyFav = useCallback(() => {
    if (isFav) {
      realm.write(() => {
        realm.delete(realm.objects('FavCoins').filtered('id == $0', id));
      });
    } else {
      realm.write(() => {
        realm.create('FavCoins', {
          id,
        });
      });
    }
    setFav(!isFav);
  }, [isFav, id]);

  if (Object.keys(data).length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" color="#334454" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex flex-row items-center justify-between p-3`}>
        <Svg
          style={tw`h-7 w-7 text-gray-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onPress={() => navigation.goBack()}>
          <Path d="m10 19-7-7m0 0 7-7m-7 7h18" />
        </Svg>
        <View style={tw`flex flex-row items-center`}>
          <Image
            style={tw`h-8 w-8`}
            source={{
              uri: data.image_small,
            }}
          />
          <Text style={tw`text-white text-lg font-semibold ml-2`}>
            {data.name}
          </Text>
        </View>
        {isFav ? (
          <Svg
            style={tw`h-8 w-8 text-yellow-500`}
            viewBox="0 0 20 20"
            fill="currentColor"
            onPress={() => modifyFav()}>
            <Path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
          </Svg>
        ) : (
          <Svg
            style={tw`h-8 w-8 text-gray-500`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onPress={() => modifyFav()}>
            <Path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z" />
          </Svg>
        )}
      </View>
      <ScrollView>
        <View style={tw`p-3`}>
          <Text style={tw`text-white text-lg`}>Current Price:</Text>
          <View style={tw` mt-1 flex flex-row items-center`}>
            <Text style={tw`text-white text-2xl font-semibold mr-1.5`}>
              $
              {parseFloat(data.price)
                .toFixed(8)
                .replace(/\.?0+$/, '')}
            </Text>
            <Text
              style={tw.style(
                {
                  'text-red-500': data.price_change_percentage_24h < 0,
                  'text-green-500': data.price_change_percentage_24h >= 0,
                },
                'font-semibold text-lg',
              )}>
              {parseFloat(data.price_change_percentage_24h).toFixed(2)}%
            </Text>
            {data.price_change_percentage_24h < 0 ? (
              <Svg
                style={tw`h-4 w-4 text-red-500`}
                fill="none"
                viewBox="0 0 24 24"
                mx
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
        <View style={tw`pt-3`}>
          <View style={tw`px-3 flex flex-row flex-nowrap`}>
            <Pressable
              onPress={() => {
                setDays(1);
              }}
              style={tw.style(
                'p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 1,
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 1,
                })}>
                24h
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDays(7);
              }}
              style={tw.style(
                'mr-2 p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 7,
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 7,
                })}>
                7d
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDays(30);
              }}
              style={tw.style(
                'mr-2 p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 30,
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 30,
                })}>
                30d
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDays(90);
              }}
              style={tw.style(
                'mr-2 p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 90,
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 90,
                })}>
                90d
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDays(365);
              }}
              style={tw.style(
                'mr-2 p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 365,
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 365,
                })}>
                1y
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDays('max');
              }}
              style={tw.style(
                'mr-2 p-4 rounded-t-lg border-b-2 border-transparent',
                {
                  'border-blue-500': days === 'max',
                },
              )}>
              <Text
                style={tw.style('text-gray-500', {
                  'text-blue-500': days === 'max',
                })}>
                max
              </Text>
            </Pressable>
          </View>
          <CoinChart id={id} days={days} />
        </View>
        <View style={tw`p-3`}>
          <View
            style={tw`py-2 border-b border-gray-500 flex flex-row justify-between`}>
            <Text style={tw`text-white`}>Market Capitalization</Text>
            <Text style={tw`text-white ml-5`}>
              $
              {parseFloat(data.market_cap)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                .replace(/\.?0+$/, '')}
            </Text>
          </View>
          <View
            style={tw`py-2 border-b border-gray-500 flex flex-row justify-between`}>
            <Text style={tw`text-white`}>24h Trading Volume</Text>
            <Text style={tw`text-white ml-5`}>
              $
              {parseFloat(data.total_volume)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                .replace(/\.?0+$/, '')}
            </Text>
          </View>
          <View
            style={tw`py-2 border-b border-gray-500 flex flex-row justify-between`}>
            <Text style={tw`text-white`}>Volume / Market Cap</Text>
            <Text style={tw`text-white ml-5`}>
              {parseFloat(data.total_volume / data.market_cap).toFixed(4)}
            </Text>
          </View>
          <View style={tw`py-2 flex flex-row justify-between`}>
            <Text style={tw`text-white`}>24h Low / 24h High</Text>
            <Text style={tw`text-white ml-5`}>
              $
              {parseFloat(data.low)
                .toFixed(8)
                .replace(/\.?0+$/, '')}{' '}
              / $
              {parseFloat(data.high)
                .toFixed(8)
                .replace(/\.?0+$/, '')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Coin;
