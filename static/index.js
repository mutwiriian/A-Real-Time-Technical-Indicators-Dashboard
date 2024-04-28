const timeEl = document.getElementById('t')
const emaEl = document.getElementById('ema')
const wmaEl = document.getElementById('wma')
const atrEl = document.getElementById('atr')

function websocket_connect(){
    const symbol = document.getElementById('symbol').value
    console.log(symbol)
    const ws =  new WebSocket(`ws://127.0.0.1:8000/ws/${symbol}`)

    ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    console.log(data)

    timeEl.innerText = data['time'];
    emaEl.innerText = `Closing price EMA: ${data['ema']}`;
    wmaEl.innerText = `Closing price WMA: ${data['wma']}`;
    atrEl.innerText = `Closing price ATR: ${data['atr']}`;
    }

};