const ctxOne = document.getElementById('chart-one').getContext('2d')
const ctxTwo = document.getElementById('chart-two').getContext('2d')
const ctxThree = document.getElementById('chart-three').getContext('2d')
const ctxFour = document.getElementById('chart-four').getContext('2d')

const chartOne = new Chart(ctxOne, {
    type: 'line',
    data: {
        labels: [],
        datasets: 
            [
                {
                    data: [],
                    label: 'Actual',
                    borderColor: '#3e95cd',
                    fill: false
                },
                {
                    data: [],
                    label: 'Moving Average',
                    borderColor: '#850606',
                    fill: false
                }
            ]
    },

    options: {
        title: {
            display: true,
            text: 'ETH/USDT on Binance'
        },
        tension: 0.3,
        responsive: true
    }
})

const chartTwo = new Chart(ctxTwo, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Moving Average Convergence Divergence Index',
                borderColor: '#06920d',
                fill: false
            }
        ]
    },

    options: {
        title: {
            display: true,
            text: 'ETH/USDT MACD'
        },
        tension: 0.3,
        responsive: true
    }
})

const chartThree = new Chart(ctxThree, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Relative Strength Index',
                borderColor: '#0933bc',
                fill: false
            }
        ]
    },
    options: {
        tension: 0.3,
        responsive: true
    }
})

const chartFour = new Chart(ctxFour, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Average True Range Index',
                borderColor: '#ea3a3a',
                fill: false
            }
        ]
    },
    options: {
        tension: 0.3,
        responsive: true,
    }
})

const charts = [chartOne, chartTwo, chartThree, chartFour]

function websocket_connect(){
    let symbol = document.getElementById('symbol').value

    const ws = new WebSocket(`ws:/127.0.0.1:8000/ws/${symbol}`)

    ws.onmessage = function(message){
        let data = JSON.parse(message.data)

        chartOne.data.labels.push(data.time)
        chartOne.data.datasets[0].data.push(data.actual)
        chartOne.data.datasets[1].data.push(data.ema)
        chartOne.update()


        chartTwo.data.labels.push(data.time)
        chartTwo.data.datasets[0].data.push(data.macd)
        chartTwo.update()


        chartThree.data.labels.push(data.time)
        chartThree.data.datasets[0].data.push(data.rsi)
        chartThree.update()


        chartFour.data.labels.push(data.time)
        chartFour.data.datasets[0].data.push(data.atr)
        chartFour.update()


        charts.forEach(chart => {
            if(chart.data.labels.length > 40){
                chart.data.labels.shift();
                chart.data.datasets.forEach((dataset) => {
                    dataset.data.shift();
                })
            }
        });

    }
}
