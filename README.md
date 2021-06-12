# probly-search demo
A small recipe search example. With 50k recipe names indexed using WASM. Built with React. 

## Run the demo (on github pages)
[https://quantleaf.github.io/probly-search-demo/](https://quantleaf.github.io/probly-search-demo/)


## Run locally
```properties
cd www
yarn install
yarn start
```
Then go to *http://localhost:3000*

## About this demo
This demo source contains a WASM wrapper library [probly-search-wasm](https://github.com/quantleaf/probly-search-demo/tree/master/probly-search-wasm) of the [probly-search](https://github.com/quantleaf/probly-search). This in order to provide binding to javascript, which is later used in the React project [www](https://github.com/quantleaf/probly-search-demo/tree/master/www).

The WASM build is generated using [wasm-pack](https://github.com/rustwasm/wasm-pack). If you want to build the WASM code you have to install wasm-pack from the Github repository directly as the latest release contains a fatal bug regarding the *files* field in the generated *package.json* (which is fixed in the current master branch).

