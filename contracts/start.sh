#!/bin/bash

#kill -9 $(lsof -ti tcp:3600) #kill app
kill -9 $(lsof -ti tcp:8545) #kill test node

ganache_url="http://localhost:8545"
relayer_port=8099
relayer_url="http://localhost:${relayer_port}"

ganache-cli -m "timber initial unhappy transfer genre divorce noodle liberty hen steel trumpet clever" -i "666" &> /dev/null & #& #todo increase account size, set networkid
sleep 3 #wait for ganache to spin up
#GCLI=$!
#wait $GCLI
#truffle migrate --reset
npx oz-gsn deploy-relay-hub --ethereumNodeURL http://localhost:8545
npx oz-gsn run-relayer --quiet &> /dev/null & #npx oz-gsn run-relayer --quiet
echo "Started Relayer"
rm ./build/contracts/*.json #dragons
truffle compile
truffle migrate --reset
npx oz-gsn fund-recipient --recipient 0xd7d41932F3d8D22869C207e0a7cD038EA9746c68 #this needs to go - we cannot rely on hardcoding
#could launch a script to print the details we lose from ganache
echo "Finished setup of test eth node, contracts and relayer"