import {baseURL, priceFeedId, fetchPythPrice} from './priceFeed.js'

const queries = priceFeedId.map((priceFeed) => `ids[]=${priceFeed.id}`).join('&');
const url = `${baseURL}${queries}`

const ctx = document.getElementById('myChart').getContext('2d');
const form = document.getElementsByClassName('form')[0]
const dropDown = document.getElementsByClassName('crypto-dropdown')[0]

let selectedCrypto

priceFeedId.forEach((priceFeed)=> {
    dropDown.innerHTML += `<option value="${priceFeed.sym}">${priceFeed.sym.toUpperCase()}</option>`
})

form.addEventListener('submit', (e)=> {
    e.preventDefault()
    selectedCrypto = dropDown.value
    myLineChart.data.datasets[0].label = `${selectedCrypto.toUpperCase()}`
    myLineChart.data.datasets[0].data = []
    myLineChart.data.datasets[1].data = []
    myLineChart.data.datasets[2].data = []
    myLineChart.data.labels = []
})

// Create a new Chart instance
const myLineChart = new Chart(ctx, {
    type: 'line', // Line chart type
    data: {
        labels: [],
        datasets: [{
            label: 'BTC',
            data: [], // Sample data points
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.3)', // Fill under the line
            borderWidth: 5,
            pointRadius: 0, // Point size
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
            fill: false // Fill area under the line
        }, 
        {
            label: 'upperbound',
            data: [], // Sample data points
            borderColor: 'rgba(75, 255, 255, 0.3)', // Line color
            backgroundColor: 'rgba(75, 255, 255, 0.3)', // Fill under the line
            borderWidth: 1,
            pointRadius: 0, // Point size
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
            fill: '+1' // Fill area under the line
        }, 
        {
            label: 'lowerbound',
            data: [], // Sample data points
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.3)', // Fill under the line
            borderWidth: 1,
            pointRadius: 0, // Point size
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
            fill: false // Fill area under the line
        }
    ]
    },
    options: {
        responsive: true,
        animation: {
            duration: 500, // Smooth transition for X-axis
            easing: 'linear'
        },
        scales: {
            x: {
                ticks: {
                    color: 'whitesmoke',
                    font: {
                        size: 20
                    } 
                }
            },
            y: {
                ticks: {
                    color: 'whitesmoke',
                    font: {
                        size: 20
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'whitesmoke',
                    font: {
                        size: 40
                    }
                }
            }
        }
    }
});

function updateChartValue(publishTime, price, confidence) {
    if(myLineChart.data.labels.length >= 100) {
        myLineChart.data.labels.shift();  // Remove first label
        myLineChart.data.datasets[0].data.shift()
        myLineChart.data.datasets[1].data.shift()
        myLineChart.data.datasets[2].data.shift()
    }
    myLineChart.data.labels.push(`${publishTime}`); // Add new label
    myLineChart.data.datasets[0].data.push(Number(price))
    myLineChart.data.datasets[1].data.push(Number(price) + confidence)
    myLineChart.data.datasets[2].data.push(Number(price) - confidence)

    myLineChart.options.scales.y.min = Number(price) * 0.995
    myLineChart.options.scales.y.max = Number(price) * 1.005
    myLineChart.update();
}

const priceFeedFetcher = setInterval(async ()=> {
    const priceFeeds  = await fetchPythPrice(url)
    if(selectedCrypto) {
        const selectedPriceFeed = priceFeeds.filter((priceFeed)=> priceFeed.name === selectedCrypto)[0]
        updateChartValue(selectedPriceFeed.publishTime, selectedPriceFeed.price, selectedPriceFeed.confidence)

    } else {
        // default to use BTC priceFeed
        updateChartValue(priceFeeds[0].publishTime, priceFeeds[0].price, priceFeeds[0].confidence)
    }
}, 500)

// setTimeout(()=> clearInterval(priceFeedFetcher), 10000)
