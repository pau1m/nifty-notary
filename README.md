README
======


Populate parameters in .env

@todo 



Testing API
===========

In contracts folder ```yarn start``` to launch all the blockchain stuff

In niftyNotaryAPI folder ```yarn start``` then in test folder ```mocha [testfilename]```


```
yarn global add ganache-cli
yarn install
ganache-cli -m "timber initial unhappy transfer genre divorce noodle liberty hen steel trumpet clever" 
npx oz-gsn deploy-relay-hub --ethereumNodeURL http://localhost:8545
npx oz-gsn run-relayer
truffle test
```


Node end points
===============

* https://ropsten.infura.io/v3/72558b256e3148358d057eea53feb029
* https://mainnet.infura.io/v3/72558b256e3148358d057eea53feb029
