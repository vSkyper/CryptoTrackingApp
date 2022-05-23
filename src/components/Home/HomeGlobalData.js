import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';

const HomeGlobalData = () => {
  const [globalInfo, setGlobalInfo] = useState({});

  useEffect(() => {
    setGlobalInfo({
      total_market_cap: 0,
      total_volume_24h: 0,
      bitcoin_percentage_of_market_cap: 0,
      active_currencies: 0,
    });

    return () => {
      setGlobalInfo({});
    };
  }, []);

  return (
    <View style={tw`mb-6 px-3`}>
      <Text style={tw`text-base text-white`}>
        The global cryptocurrency market cap today is $
        {parseFloat(
          globalInfo.total_market_cap_in_usd / Math.pow(10, 12),
        ).toFixed(2)}{' '}
        Trillion, a{' '}
        <Text
          style={tw.style({
            'text-red-500': globalInfo.market_cap_change_percentage_24h < 0,
            'text-green-500': globalInfo.market_cap_change_percentage_24h >= 0,
          })}>
          {parseFloat(globalInfo.market_cap_change_percentage_24h).toFixed(2)}%{' '}
        </Text>
        change in the last 24 hours. Total cryptocurrency trading volume in the
        last day is at $
        {parseFloat(globalInfo.total_volume_in_usd / Math.pow(10, 9)).toFixed(
          2,
        )}{' '}
        Billion. Bitcoin dominance is at{' '}
        {parseFloat(globalInfo.market_cap_percentage_btc).toFixed(2)}% and
        Ethereum dominance is at{' '}
        {parseFloat(globalInfo.market_cap_percentage_eth).toFixed(2)}%.
        CoinGecko API is now tracking {globalInfo.active_cryptocurrencies}{' '}
        cryptocurrencies.
      </Text>
    </View>
  );
};

export default HomeGlobalData;
