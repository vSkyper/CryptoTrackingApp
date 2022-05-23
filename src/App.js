import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import tw from 'twrnc';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WithSplashScreen} from './SplashScreen';
import Home from './components/Home/Home';
import Coin from './components/Coin';
import FavCoins from './components/FavCoins';
import {fetchGlobalData, fetchCoinsInfo} from './data/fetchData';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const fetchGlobalDataPromise = fetchGlobalData();

    const fetchCoinsInfoPromise = fetchCoinsInfo();

    Promise.all([fetchGlobalDataPromise, fetchCoinsInfoPromise]).then(() => {
      setIsAppReady(true);
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
        <SafeAreaView style={tw`flex-1 bg-gray-800`}>
          <StatusBar barStyle={'dark-content'} />
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
