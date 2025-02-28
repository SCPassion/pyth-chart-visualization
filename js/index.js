import {priceFeedId} from './priceFeed.js'

const baseURL = "https://hermes.pyth.network/v2/updates/price/latest?";
const queries = priceFeedId.map((priceFeed) => `ids[]=${priceFeed.id}`).join('&');
const url = `${baseURL}${queries}`

async function fetchPythPrice() {    
    const response = await fetch(url)
    const data = await response.json()

    return data.parsed.map((priceObj)=> {
        const sym = priceFeedId.filter((priceFeed)=>priceFeed.id === priceObj.id)[0].sym
        const publishDate = new Date(priceObj.ema_price.publish_time * 1000)
        const formattedDate = publishDate.toLocaleString()
        return {
            id: priceObj.id,
            name: sym,
            publishTime: formattedDate,
            price: Number(priceObj.ema_price.price) * 10**priceObj.ema_price.expo,
            confidence: Number(priceObj.ema_price.conf) * 10**priceObj.ema_price.expo
        }
    })
}

const priceFeedFetcher = setInterval(async ()=> {
    console.log(await fetchPythPrice())
}, 1000)

setTimeout(()=> clearInterval(priceFeedFetcher), 10000)


// const ctx = document.getElementById('myChart').getContext('2d');

// let index = 0;
// // Create a new Chart instance
// const myLineChart = new Chart(ctx, {
//     type: 'line', // Line chart type
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//         datasets: [{
//             label: 'Monthly Sales',
//             data: [10, 20, 15, 25, 30, 40], // Sample data points
//             borderColor: 'rgba(75, 192, 192, 1)', // Line color
//             backgroundColor: 'rgba(75, 192, 192, 0.3)', // Fill under the line
//             borderWidth: 2,
//             pointRadius: 5, // Point size
//             pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
//             fill: true // Fill area under the line
//         }]
//     },
//     options: {
//         responsive: true,
//         animation: {
//             duration: 500, // Smooth transition for X-axis
//             easing: 'linear'
//         }
//     }
// });

// // function updateChart() {
// //     myLineChart.data.datasets[0].label = "fuck"
// //     myLineChart.update()
// // }

// function updateValue() {
//     myLineChart.data.labels.shift();  // Remove first label
//     myLineChart.data.labels.push(`T${index}`); // Add new label
    
//     myLineChart.data.datasets[0].data.shift()
//     myLineChart.data.datasets[0].data.push(index)
//     index = index + 2
//     myLineChart.update();
// }

// const updatehandler = setInterval(updateValue, 500)

// setTimeout(()=> {
//     clearInterval(updatehandler)
// }, 10000)