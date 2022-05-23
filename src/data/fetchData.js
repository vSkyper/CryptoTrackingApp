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
