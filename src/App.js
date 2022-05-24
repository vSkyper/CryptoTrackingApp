import React, {useEffect, useState} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import tw from 'twrnc';
import {WithSplashScreen} from './SplashScreen';
import Home from './components/Home/Home';
import Coin from './components/Coin';
import FavCoins from './components/FavCoins';
import realm from './data/Database';
import {fetchGlobalData, fetchCoinsInfo} from './data/fetchData';
import Notifications from './Notifications';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const fetchGlobalDataPromise = fetchGlobalData();

    const fetchCoinsInfoPromise = fetchCoinsInfo();

    Promise.all([fetchGlobalDataPromise, fetchCoinsInfoPromise]).then(() => {
      setIsAppReady(true);

      let FavCoins = realm.objects('FavCoins');

      if (FavCoins.length !== 0) {
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

        const maxPercentage = Math.max(
          ...CoinsInfo.map(coin => coin.price_change_percentage_24h),
        );
        const minPercentage = Math.min(
          ...CoinsInfo.map(coin => coin.price_change_percentage_24h),
        );

        const maxCoin = CoinsInfo.find(
          coin => coin.price_change_percentage_24h === maxPercentage,
        );
        const minCoin = CoinsInfo.find(
          coin => coin.price_change_percentage_24h === minPercentage,
        );

        if (maxCoin.price_change_percentage_24h > 0) {
          Notifications.scheduleNotification(
            `🚀 ${maxCoin.symbol.toUpperCase()} is up ${parseFloat(
              maxCoin.price_change_percentage_24h,
            ).toFixed(2)}%`,
            `In the past 24 hours. It's now $${parseFloat(maxCoin.current_price)
              .toFixed(8)
              .replace(/\.?0+$/, '')}`,
            1,
          );
        }
        if (minCoin.price_change_percentage_24h < 0) {
          Notifications.scheduleNotification(
            `😔 ${minCoin.symbol.toUpperCase()} is down ${parseFloat(
              minCoin.price_change_percentage_24h,
            ).toFixed(2)}%`,
            `In the past 24 hours. It's now $${parseFloat(minCoin.current_price)
              .toFixed(8)
              .replace(/\.?0+$/, '')}`,
            1,
          );
        }
      }
    });
  }, []);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: null,
        },
      }}>
      <StatusBar
        backgroundColor={tw.color('zinc-900')}
        barStyle={'dark-content'}
      />
      <WithSplashScreen isAppReady={isAppReady}>
        <SafeAreaView style={tw`flex-1 bg-zinc-900`}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Coin" component={Coin} />
            <Stack.Screen name="FavCoins" component={FavCoins} />
          </Stack.Navigator>
        </SafeAreaView>
      </WithSplashScreen>
    </NavigationContainer>
  );
};

export default App;
