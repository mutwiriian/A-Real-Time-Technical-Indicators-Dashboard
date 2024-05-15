import websockets

from talipp.ohlcv import OHLCV
from talipp.indicators import ATR, EMA, MACD, RSI
from talipp.indicator_util import composite_to_lists

from collections import deque

import json
from datetime import datetime

     
async def binance_connect(uri: str):   
    periods = 5

    actual = deque(maxlen=5)

    atr = ATR(period=periods)
    ema = EMA(period=periods)
    macd = MACD(
        fast_period=3,
        slow_period=5,
        signal_period=5, 
        # input_sampling= SamplingPeriodType.SEC_5
        )
    rsi = RSI(period=3)
    try:
        async with websockets.connect(uri=uri) as websocket:
            async for message in websocket:
                data = json.loads(message)
                kline_data = data.get('k')
                ohlcv = OHLCV(
                    open= float(kline_data['o']),
                    high= float(kline_data['h']),
                    low= float(kline_data['l']),
                    close= float(kline_data['c']),
                    volume= float(kline_data['v']),
                    time= datetime.fromtimestamp(kline_data['t']/1000)
                    )
                
                actual.append(ohlcv.close)

                if len(ema) < 5:
                    atr.add(ohlcv)
                    ema.add(ohlcv.close)
                    macd.add(ohlcv.close) 
                    rsi.add(ohlcv.close)
                else:
                    atr.purge_oldest(1)
                    ema.purge_oldest(1)
                    macd.purge_oldest(1)
                    rsi.purge_oldest(1)
                    
                    atr.add(ohlcv)
                    ema.add(ohlcv.close)
                    macd.add(ohlcv.close)
                    rsi.add(ohlcv.close)
                    
                if ema[-1] is not None:
                    indicator_data = {'actual': round(actual[-1],2),
                                      'atr': round(atr[-1],2),
                                      'ema': round(ema[-1],2),
                                      'macd': round(composite_to_lists(macd).get('macd')[-1],2),
                                      'rsi': round(rsi[-1]),
                                      'time': ohlcv.time.time().strftime("%M:%S")}
                    yield indicator_data
    finally:
        await websocket.close()


        


