import {baseURL, priceFeedId, fetchPythPrice} from './priceFeed.js'

const queries = priceFeedId.map((priceFeed) => `ids[]=${priceFeed.id}`).join('&');
const url = `${baseURL}${queries}`

const ctx = document.getElementById('myChart').getContext('2d');

// Create a new Chart instance
const myLineChart = new Chart(ctx, {
    type: 'line', // Line chart type
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Monthly Sales',
            data: [10, 20, 15, 25, 30, 40], // Sample data points
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.3)', // Fill under the line
            borderWidth: 2,
            pointRadius: 5, // Point size
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
            fill: true // Fill area under the line
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 500, // Smooth transition for X-axis
            easing: 'linear'
        }
    }
});

function updateChartValue(publishTime, price) {
    myLineChart.data.labels.shift();  // Remove first label
    myLineChart.data.labels.push(`${publishTime}`); // Add new label
    
    myLineChart.data.datasets[0].data.shift()
    myLineChart.data.datasets[0].data.push(price)
    myLineChart.update();
}

const priceFeedFetcher = setInterval(async ()=> {
    const priceFeeds  = await fetchPythPrice(url)
    updateChartValue(priceFeeds[0].publishTime, priceFeeds[0].price)
}, 2000)

setTimeout(()=> clearInterval(priceFeedFetcher), 10000)


// const updatehandler = setInterval(updateValue, 500)

// setTimeout(()=> {
//     clearInterval(updatehandler)
// }, 10000)