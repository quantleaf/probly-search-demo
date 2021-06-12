# probly-search demo
A small recipe search example. With 50k recipe names indexed using WASM. Built with React. 

## Run locally
```properties
cd www
yarn install
yarn start
```
Then go to *http://localhost:3000*

## About this demo
This demo source contains a WASM wrapper library of the [probly-search](https://github.com/quantleaf/probly-search) ("probly-search-wasm"). This in order to provide binding to javascript, which is later used in the React project "www".

The WASM build is generated using [wasm-pack](https://github.com/rustwasm/wasm-pack). You have to install wasm-pack from the Github repository directly as the latest release contains a fatal bug regarding the file *files* field in the generated *package.json* (which is fixed in the current master branch)

