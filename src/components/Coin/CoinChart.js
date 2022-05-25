import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {fetchChartData} from '../../data/fetchData';

const CoinChart = ({id, days}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchChartData(id, days).then(res => {
      setData(res);
    });

    return () => {
      setData([]);
    };
  }, [id, days]);

  if (data.length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center pt-4`}>
        <ActivityIndicator size="large" color="#334454" />
      </View>
    );
  }

  const priceChange = data[data.length - 1].value - data[0].value;

  return (
    <View>
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
