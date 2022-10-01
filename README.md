# Ponzi Game



This projects shows how implement a ponzi game  with Solidity smart Contracts and basic React UI


## Commands:

### Test Stamrt contracts
```shell
npm run test
```

### Up local blockchain 
```shell
npm run bc
```

### Up React UI
```shell
npm run start
```

### Deploy smart contract (Local)
Remember to wake up the local blockchain node with the previous command
```shell
npm run hh:deploy
```

### Deploy on No local network
You can configure the ````hardhat.config.ts```` to add you custom networks , [here](https://hardhat.org/hardhat-runner/docs/config)

and run the command with your custom network 

```shell
npx hardhat run --network <your-network> scripts/deploy.js
```
