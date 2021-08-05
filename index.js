const cheerio = require('cheerio');
const got = require('got');

const domain = 'https://polygonscan.com/';
const pages = new Set();
const transactions = new Set();

async function getPage(href) {
    if (!pages.has(href)) {
        pages.add(href);
        console.log('loading page', href);

        const response = await got(domain + href);
        const body = cheerio.load(response.body);

        for (let link of body('a')) {
            const href = link.attribs.href;
            if (href && href.startsWith('/tx/')) {
                transactions.add(href.substring(4));
            }
            else if (href && href.startsWith('txs?')) {
                await getPage(href);
            }
        }
    }
}

function getTrxn(href) {
    console.log(href);
}

(async function () {
    await getPage('txs?a=0x4b223cb2e1f91ad59b86f5798a1fc53f73e244b0&p=1');
    let i = 0;
    for (let item of transactions) console.log(i++, 'trxn', item);
})();


// 2021-08-04 9:43am approved FUND to add liquidity