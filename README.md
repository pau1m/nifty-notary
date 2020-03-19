README
======

About
=====

Repo is composed of three parts.

* contracts: Smart contracts, tests for contracts and deployment of contracts and setup of Gas Station Network (GSN).
* API: API for posting files and hashes to Ethereum blockchain.
* WebApp: Very basic demo application for drag and drop proof of existence. 
    
How It Works
============

Users may post an arbitrary base64 encoded file or 32 byte hex encoded digest.

Uses Gas Station Network to forward transactions. Thus, users account holders may participate with out owning any eth.
 
Whats in the version
==================== 

For simplicity and speed of roll out
 
 
 @see
```
https://eips.ethereum.org/EIPS/eip-1613
https://github.com/OpenZeppelin/gsn-site
```

#Getting Started

```
cp example.env .env
cd contract 
yarn install
cd ../niftyNotaryAPI
yarn install
```

Populate .env values

```
cd ./contract
yarn start
cd ../niftyNotaryAPi
yarn start
```

Manually add an administrative user. @todo automate this.
```
node niftyNotaryAPI/test/createUser.js
```

##Requirements

###MongoDB v4.2

On OSX Install with

```
brew tap gapple/services
brew install mongodb-community
brew services start mongodb-community
```

###Node v10.17

Untested with other versions - you may need to use NVM

### Truffle >= v5 (untested with v6)
```yarn global add truffle@5.1.11```

### ganache-cli v6.x
```yarn global add ganache-cli```

Testing API
===========

Testing just contracts. In contracts folder ```truffle test```

In contracts folder ```yarn start``` launches a local instance of ganache-cli in background, deployes contracts, launches a relayer and funds the contract on relay hub

In niftyNotaryAPI folder ```yarn start``` API available at localhost:8080. Run tests with ```mocha [testfilename]```

To start web app for testing. In niftyNotaryWebApp folder ('yarn start' is not setup for CORS).

```
yarn build
cd build
http-server --cors='*'
```

Broken in Brave browser. Drag and drop a file on to browser to upload to blockchain.

Click testing with Swagger. @too maybe an additional step to fetch the docker image. Oh and you need to have docker installed.
If you install Docker through brew, be aware that have to click run it from Applications folder (mac
and then you'll be able to get it on the command line.

Access swagger at localhost:80

```
cd  niftyNotaryAPI/tests
sh startSwagger.sh
```


Manually fund RelayerHub at
```https://gasstation.network/recipients/[contractAddress]```

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



# Setting up for live

The Api will need to have an administrative user added. After setting up the database.
Manually update values in script at ```niftyNotaryAPI/tests/createUser.js``` and run it with ```node createUser.js```
