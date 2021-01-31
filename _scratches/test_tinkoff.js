var OpenAPI = require('@tinkoff/invest-openapi-js-sdk');

const apiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = 't.wm18U_3fAiNNtFiTBGEIfrmr5NDLM-xQCA2wKZyBocV_So37sT1beqUAw9ixZ98pvxU0ssjhx6eV94Sby9h8jg'; // токен для сандбокса
const api = new OpenAPI({apiURL, secretToken, socketURL});


async function run() {

   // await api.sandboxClear();
   //  console.log(await api.setCurrenciesBalance({currency: 'USD', balance: 1000})); // 1000$ на счет

    console.log(await api.stocks());

    console.log(await api.portfolioCurrencies());


    try {
        var {figi} = await api.searchOne({ticker: 'AAPL'});

        console.log("Portfolio:", await api.instrumentPortfolio({figi}));

    } catch (e) {
        console.log(e);
    }
    // try {
    //     var {commission, orderId} = await api.limitOrder({
    //         operation: 'Buy',
    //         figi,
    //         lots: 1,
    //         price: 121,
    //     }); // Покупаем AAPL
    // } catch (e) {
    //     console.log('order error', e);
    // }

    console.log('Comission ', commission); // Комиссия за сделку
    await api.cancelOrder({orderId}); // Отменяем заявку
}

run().then(
    result => {console.log("OK", result)}
).catch(error => {console.log("Error", error)});
