import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import tw from 'twrnc';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import realm from '../data/Database';

const Coin = ({route}) => {
  const navigation = useNavigation();

  const {id} = route.params;

  const [data, setData] = useState({});

  const [isFav, setFav] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();

    return () => {
      setData({});
    };
  }, []);

  useEffect(() => {
    const FavCoins = realm.objects('FavCoins').filtered('id == $0', id);
    if (Object.keys(FavCoins).length !== 0) {
      setFav(true);
    } else {
      setFav(false);
    }

    return () => {
      setFav(false);
    };
  }, [id]);

  const fetchData = useCallback(() => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      )
        .then(response => response.json())
        .then(data => {
          setData({
            name: data.name,
            price: data.market_data.current_price.usd,
            price_change_percentage_24h:
              data.market_data.price_change_percentage_24h,
            price_change_percentage_7d:
              data.market_data.price_change_percentage_7d,
            market_cap: data.market_data.market_cap.usd,
            total_volume: data.market_data.total_volume.usd,
            low: data.market_data.low_24h.usd,
            high: data.market_data.high_24h.usd,
            image_small: data.image.small,
            chart: data.market_data.sparkline_7d.price.map(item => {
              return {value: item};
            }),
          });
          resolve();
        });
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
          <Text style={tw`text-white text-lg font-semibold px-3`}>
            7 Days Chart:
          </Text>
          <GestureHandlerRootView>
            <LineChart.Provider data={data.chart}>
              <LineChart height={150}>
                <LineChart.Path
                  color={
                    data.price_change_percentage_7d < 0
                      ? tw.color('red-500')
                      : tw.color('green-500')
                  }>
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair
                  color={
                    data.price_change_percentage_7d < 0
                      ? tw.color('red-500')
                      : tw.color('green-500')
                  }>
                  <LineChart.Tooltip>
                    <LineChart.PriceText
                      precision={8}
                      style={tw`text-white`}
                      format={({value}) => {
                        'worklet';
                        return `$${value}`;
                      }}
                    />
                  </LineChart.Tooltip>
                </LineChart.CursorCrosshair>
              </LineChart>
            </LineChart.Provider>
          </GestureHandlerRootView>
        </View>
        <View style={tw`p-3`}>
          <View
            style={tw`py-2 border-b border-slate-700 flex flex-row justify-between`}>
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
            style={tw`py-2 border-b border-slate-700 flex flex-row justify-between`}>
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
            style={tw`py-2 border-b border-slate-700 flex flex-row justify-between`}>
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
