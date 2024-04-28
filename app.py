import uvicorn

from fastapi import FastAPI, Request, WebSocket
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from connect import binance_connect
     
app = FastAPI()
app.mount(path='/static', app=StaticFiles(directory='static'), name='static')

template = Jinja2Templates(directory='templates')

@app.get('/page')
def get_page(request: Request ):
    return template.TemplateResponse(request=request, name='charts.html')

@app.websocket('/ws/{symbol}')
async def ws_connect(websocket: WebSocket, symbol: str):
   await websocket.accept()
   uri = f"wss://stream.binance.com:443/ws/{symbol}@kline_1s"

   async for indicator_data in binance_connect(uri=uri):
       await websocket.send_json(indicator_data)
      

if __name__ == '__main__':
    uvicorn.run(app='app:app', reload=True, workers=2)
    
    