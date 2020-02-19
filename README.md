README
======

@todo v2
*  now that all the pieces are put together reworking api to match what is given in swagger



Testing API
===========

Testing just contracts. In contracts folder ```truffle test```

In contracts folder ```yarn start``` launches a local instance of ganache-cli in background, deployes contracts, launches a relayer and funds the contract on relay hub

In niftyNotaryAPI folder ```yarn start``` API available at localhost:8080. Run tests with ```mocha [testfilename]```


Click testing with Swagger. @too maybe an additional step to fetch the docker image. Oh and you need to have docker installed.
If you install Docker through brew, be aware that have to click run it from Applications folder (mac
and then you'll be able to get it on the command line.

Access swagger at localhost:80

```
cd  niftyNotaryAPI/tests
sh startSwagger.sh
```

To start blockchain stuff manually
==================================

Deploy contracts to testnet

```Truffle migrate --reset --network ropsten``` Note the contract address and put it in .env

```
yarn global add ganache-cli
yarn install
ganache-cli -m "timber initial unhappy transfer genre divorce noodle liberty hen steel trumpet clever" 
npx oz-gsn deploy-relay-hub --ethereumNodeURL http://localhost:8545
npx oz-gsn fund-recipient --recipient <address> --amount 50000000
npx oz-gsn run-relayer
truffle test
```


Node end points
===============

* https://ropsten.infura.io/v3/72558b256e3148358d057eea53feb029
* https://mainnet.infura.io/v3/72558b256e3148358d057eea53feb029

#Test and Usage

