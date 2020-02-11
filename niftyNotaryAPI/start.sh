kill -9 $(lsof -ti tcp:3600) #kill app
kill -9 $(lsof -ti tcp:8545) #kill test node


ganache_url="http://localhost:8545"
relayer_port=8099
relayer_url="http://localhost:${relayer_port}"
cd ../contracts
ganache-cli -m "timber initial unhappy transfer genre divorce noodle liberty hen steel trumpet clever" -i "666" &> /dev/null & #& #todo increase account size, set networkid
truffle migrate --reset
npx oz-gsn deploy-relay-hub --ethereumNodeURL http://localhost:8545
npx oz-gsn run-relayer &> /dev/null &
truffle migrate --reset
#could launch a script to print the details we lose from ganache
echo "Finished setup"