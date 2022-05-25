import realm from './Database';

export const fetchGlobalData = async () => {
  const data = await fetch('https://api.coingecko.com/api/v3/global');
  const json = await data.json();

  return realm.write(() => {
    realm.delete(realm.objects('GlobalData'));

    realm.create('GlobalData', {
      _id: 0,
      total_market_cap_in_usd: json.data.total_market_cap.usd,
      market_cap_change_percentage_24h:
        json.data.market_cap_change_percentage_24h_usd,
      total_volume_in_usd: json.data.total_volume.usd,
      market_cap_percentage_btc: json.data.market_cap_percentage.btc,
      market_cap_percentage_eth: json.data.market_cap_percentage.eth,
      active_cryptocurrencies: json.data.active_cryptocurrencies,
    });
  });
};

export const fetchCoinsInfo = async () => {
  const data = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h',
  );
  const json = await data.json();

  return realm.write(() => {
    realm.delete(realm.objects('CoinsInfo'));

    json.forEach(coin => {
      realm.create('CoinsInfo', {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        image: coin.image,
      });
    });
  });
};

export const fetchCoinInfo = async id => {
  const data = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  );
  const json = await data.json();

  return {
    name: json.name,
    price: json.market_data.current_price.usd,
    price_change_percentage_24h: json.market_data.price_change_percentage_24h,
    price_change_percentage_7d: json.market_data.price_change_percentage_7d,
    market_cap: json.market_data.market_cap.usd,
    total_volume: json.market_data.total_volume.usd,
    low: json.market_data.low_24h.usd,
    high: json.market_data.high_24h.usd,
    image_small: json.image.small,
  };
};

export const fetchChartData = async id => {
  const data = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
  );
  const json = await data.json();

  return json.prices.map(([timestamp, value]) => ({
    timestamp,
    value,
  }));
};
