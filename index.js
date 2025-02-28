// async function fetchPythPrice() {
//     const response = await fetch('https://hermes.pyth.network/v2/updates/price/latest?ids[]=5867f5683c757393a0670ef0f701490950fe93fdb006d181c8265a831ac0c5c6&ids[]=ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace')

// // const response = await fetch('https://hermes.pyth.network/v2/price_feeds?query=btc&asset_type=crypto')
//     const data = await response.json()
//     console.log(data.parsed)
// }

// // const pythFetcher = setInterval(fetchPythPrice, 100)

// // setTimeout(()=> clearInterval(pythFetcher), 10000)

// fetchPythPrice()

// // https://hermes.pyth.network/docs/#/rest/price_feeds_metadata

const ctx = document.getElementById('myChart').getContext('2d');

let index = 0;
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

// function updateChart() {
//     myLineChart.data.datasets[0].label = "fuck"
//     myLineChart.update()
// }

function updateValue() {
    myLineChart.data.labels.shift();  // Remove first label
    myLineChart.data.labels.push(`T${index}`); // Add new label
    
    myLineChart.data.datasets[0].data.shift()
    myLineChart.data.datasets[0].data.push(index)
    index = index + 2
    myLineChart.update();
}

const updatehandler = setInterval(updateValue, 500)

setTimeout(()=> {
    clearInterval(updatehandler)
}, 10000)