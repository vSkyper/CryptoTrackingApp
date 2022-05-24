import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const CoinChart = ({data}) => {
  const priceChange = data[data.length - 1].value - data[0].value;

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
