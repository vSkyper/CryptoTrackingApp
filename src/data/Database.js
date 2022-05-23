import Realm from 'realm';

const GlobalData = {
  name: 'GlobalData',
  properties: {
    _id: 'int',
    total_market_cap_in_usd: 'float',
    market_cap_change_percentage_24h: 'float',
    total_volume_in_usd: 'float',
    market_cap_percentage_btc: 'float',
    market_cap_percentage_eth: 'float',
    active_cryptocurrencies: 'float',
  },
  primaryKey: '_id',
};

const CoinsInfo = {
  name: 'CoinsInfo',
  properties: {
    id: 'string',
    name: 'string',
    symbol: 'string',
    current_price: 'float',
    price_change_percentage_24h: 'float',
    image: 'string',
  },
  primaryKey: 'id',
};

const FavCoins = {
  name: 'FavCoins',
  properties: {
    id: 'string',
  },
  primaryKey: 'id',
};

export default new Realm({path: 'realm.cryptoDb', schema: [GlobalData, CoinsInfo, FavCoins] });