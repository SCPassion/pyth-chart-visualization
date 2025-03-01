export const priceFeedId = [
    {   sym: 'btc',
        id: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'
    },
    {   sym: 'eth',
        id: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace'
    },
    {   sym: 'atom',
        id: 'b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819'
    },
    {   sym: 'osmo',
        id: '5867f5683c757393a0670ef0f701490950fe93fdb006d181c8265a831ac0c5c6'
    },
    {   sym: 'tia',
        id: '09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723'
    }
]

export const baseURL = "https://hermes.pyth.network/v2/updates/price/latest?";

export async function fetchPythPrice(fetchUrl) {    
    const response = await fetch(fetchUrl)
    const data = await response.json()

    return data.parsed.map((priceObj)=> {
        const sym = priceFeedId.filter((priceFeed)=>priceFeed.id === priceObj.id)[0].sym
        const publishDate = new Date(priceObj.ema_price.publish_time * 1000)
        const formattedDate = publishDate.toLocaleString()

        return {
            id: priceObj.id,
            name: sym,
            publishTime: formattedDate,
            price: (Number(priceObj.ema_price.price) * 10**priceObj.ema_price.expo).toFixed(2),
            confidence: Number(priceObj.ema_price.conf) * 10**priceObj.ema_price.expo
        }
    })
}