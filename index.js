const config = require('config');
const got = require('got');

const API = 'https://api.unmarshal.com/v1';
const USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
const KEY = config.get('api_key');

async function loadWallets() {

    const chains = config.get('chains');
    const wallets = config.get('wallets');
    let total = 0;

    for (let c of chains) {
        for (let w of wallets) {
            total += await getBalance(c, w);
            await getTransactions(c, w);
        }
    }

    console.log('TOTAL', USD.format(total));
}

async function getBalance(chain, address) {
    const url = `${API}/${chain}/address/${address}/assets?auth_key=${KEY}`;
    let total = 0;
    try {
        const response = await got(url);
        const data = JSON.parse(response.body);
        for (let token of data) {
            total += token.quote;
            if (token.quote > 0.005) {
                console.log(chain, address, token.contract_ticker_symbol, USD.format(token.quote));
            }
        }
    }
    catch (e) {
        console.log('failed', e);
    }
    return total;
}

async function getTransactions(chain, address) {
    const url = `${API}/${chain}/address/${address}/transactions?auth_key=${KEY}`;
    let total = 0;
    try {
        const response = await got(url);
        const data = JSON.parse(response.body);
        console.log(data);
        // for (let token of data) {
        //     total += token.quote;
        //     if (token.quote > 0.005) {
        //         console.log(chain, address, token.contract_ticker_symbol, USD.format(token.quote));
        //     }
        // }
    }
    catch (e) {
        console.log('failed', e);
    }
    return total;
}

(async function () {
    await loadWallets();
})();
