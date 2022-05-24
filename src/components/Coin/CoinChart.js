import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const CoinChart = ({id}) => {
  const [data, setData] = useState([]);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
    )
      .then(response => response.json())
      .then(data => {
        const tempData = [];
        data.prices.map(item => {
          tempData.push({
            timestamp: item[0],
            value: item[1],
          });
        });
        setData(tempData);
        setPriceChange(
          data.prices[data.prices.length - 1][1] - data.prices[0][1],
        );
      });

    return () => {
      setData([]);
      setPriceChange(0);
    };
  }, []);

  if (data.length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" color="#334454" />
      </View>
    );
  }

  return (
    <View>
      <Text style={tw`text-white text-lg font-semibold px-3`}>
        7 Days Chart:
      </Text>
      <GestureHandlerRootView>
        <LineChart.Provider data={data}>
          <LineChart height={150}>
            <LineChart.Path
              color={
                priceChange < 0 ? tw.color('red-500') : tw.color('green-500')
              }>
              <LineChart.Gradient />
            </LineChart.Path>
            <LineChart.CursorCrosshair
              color={
                priceChange < 0 ? tw.color('red-500') : tw.color('green-500')
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
              <LineChart.Tooltip position="bottom">
                <LineChart.DatetimeText style={tw`text-white`} />
              </LineChart.Tooltip>
            </LineChart.CursorCrosshair>
          </LineChart>
        </LineChart.Provider>
      </GestureHandlerRootView>
    </View>
  );
};

export default CoinChart;
