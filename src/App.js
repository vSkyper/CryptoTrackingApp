import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import tw from 'twrnc';
import {SafeAreaView} from 'react-native-safe-area-context';
import Home from './components/Home/Home';
import Coin from './components/Coin';
import FavCoins from './components/FavCoins';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: null,
        },
      }}>
      <SafeAreaView
        style={tw`flex-1 bg-gray-800`}>
        <StatusBar barStyle={'dark-content'} />
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Coin' component={Coin} />
          <Stack.Screen name='FavCoins' component={FavCoins} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
