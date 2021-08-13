const config = require('config');
const got = require('got');

const API = 'https://api.unmarshal.com/v1';
const USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

async function loadWallets() {

    const protocols = config.get('protocols');
    const wallets = config.get('wallets');
    const key = config.get('api_key');
    let total = 0;

    for (let p of protocols) {
        for (let w of wallets) {
            total += await getWallet(p, w, key);
        }
    }

    console.log('TOTAL', USD.format(total));
}

async function getWallet(protocol, wallet, key) {
    const url = `${API}/${protocol}/address/${wallet}/assets?auth_key=${key}`;
    let total = 0;
    try {
        const response = await got(url);
        const data = JSON.parse(response.body);
        for (let token of data) {
            total += token.quote;
            if (token.quote > 0.005) {
                console.log(protocol, wallet, token.contract_ticker_symbol, USD.format(token.quote));
            }
        }
    }
    catch (e) {
        console.log('failed', e);
    }
    return total;
}

(async function () {
    await loadWallets();
})();
