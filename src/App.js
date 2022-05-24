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

      CoinsInfo.forEach(coin => {
        if (coin.price_change_percentage_24h > 5) {
          Notifications.scheduleNotification(
            `🚀 ${coin.symbol.toUpperCase()} is up ${parseFloat(
              coin.price_change_percentage_24h,
            ).toFixed(2)}%`,
            `In the past 24 hours. It's now $${parseFloat(coin.current_price)
              .toFixed(8)
              .replace(/\.?0+$/, '')}`,
            1,
          );
        } else if (coin.price_change_percentage_24h < -5) {
          Notifications.scheduleNotification(
            `😔 ${coin.symbol.toUpperCase()} is down ${parseFloat(
              coin.price_change_percentage_24h,
            ).toFixed(2)}%`,
            `In the past 24 hours. It's now $${parseFloat(coin.current_price)
              .toFixed(8)
              .replace(/\.?0+$/, '')}`,
            1,
          );
        }
      });
    });
  }, []);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: null,
        },
      }}>
      <WithSplashScreen isAppReady={isAppReady}>
        <SafeAreaView style={tw`flex-1 bg-zinc-900`}>
          <StatusBar backgroundColor={tw.color('zinc-900')} barStyle={'dark-content'} />
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
