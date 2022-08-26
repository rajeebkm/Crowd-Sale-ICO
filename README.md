# Crowd Sale ICO

## Steps

- truffle init
- Write smart sontrat in contracts folder
- Edit truffle-config.js file
- Edit/Add migrations file
- ganache-cli (Local blockchain for accounts)

## Testing


- touch test/RAJToken.js

Write test cases in RAJToken.js file.

## Initialize git

- git init
- git status

## Truffle console Demonstartion

Javascript runtime environment
- truffle console  

To compile and migrate our contract
- truffle(development)>> truffle migrate --reset 

To deploy and create intance of contract and then assign the value of the instance to a variable 'token'
- truffle(development)>> RAJToken.deployed().then(function(instance){
    tokenInstance = instance;
})

Because of asynchronous nature of our smart contracts, developing them relies heavily upon javascript promises. Javascript promises are basically a way of handling the eventual result of asynchronous application. Here deploy() will going to return a promise, whenever this promise is finished, then call the then() function, that going to accept a callback function, then set the return value, which is going to get the deployed instance of contract and set it to token variable.

- truffle(development)>> tokenInstance.address
'0x4357B32550DA07CBd337546C3B0A7845311Ec6B9'

- truffle(development)>> tokenInstance.totalSupply()
BN {
  negative: 0,
  words: [ 1000000, <1 empty item> ],
  length: 1,
  red: null
}

- truffle(development)>> tokenInstance.totalSupply().then(function(s){
    totalSupply = s;
})
undefined

- truffle(development)>> totalSupply

BN {
  negative: 0,
  words: [ 1000000, <1 empty item> ],
  length: 1,
  red: null
}

- truffle(development)>> totalSupply.toNumber()
1000000

To exit from the console
- truffle(development)>> .exit 

Get list of accounts from ganache
- truffle(development)>> web3.eth.accounts or accounts

First account, deployer
- truffle(development)>> web3.eth.accounts[0] or accounts[0]

Deploy contract, create instance of contract and assign to a variable 'token' 
- truffle(development)>> RAJToken.deployed().then(function(instance){tokenInstance=instance;})
undefine

Contract address of token
- truffle(development)>> tokenInstance.address
'0x1388cCce945d2c4893A982d9b3B9A05aAB515682'

Name of the token
- truffle(development)>> tokenInstance.name()
'RAJ Token'

Symbol of the token
- truffle(development)>> tokenInstance.name()
'RAJ'

Check Total Supply of token
- truffle(development)>> tokenInstance.totalSupply().then(function(_totalSupply){totalSupply=_totalSupply;})

Convert BN (BigNumber) to Number
- truffle(development)>> totalSupply.toNumber()
1000000

Accounts
- truffle(development)>> accounts    //web3.eth.accounts
[
  '0x778670901269f7a72d5bB88c810876340218509D',
  '0x87eD3Fd0f73134450881A35087E9C8e3f159018D',
  '0xb1d9Ff9ea2CF1C6cd24eFEA69980c5562907F3a0',
  '0xe07eA857e995487886709d61a62B39322002dc97',
  '0x25C17F6a254f48e58f68d7A9B341Dd0c91ec6A27',
  '0x3264e4Fd3894d62eC4EC19843eAB85d42A21F720',
  '0x49F20fAA33159869e3c7390CFFC66b546E1fab0e',
  '0x851bC6BDB807228FB4AA1936Af0A4885F5306759',
  '0x133355C232b89D2F1D03753BE50332efbBb54614',
  '0xc9368BD8CE61dA45f18B20C930Cd686E05f9BEd4'
]

Accounts 1
- truffle(development)>> accounts[0]  //web3.eth.accounts[0]
'0x778670901269f7a72d5bB88c810876340218509D'

Check Balance of any account
- truffle(development)>> tokenInstance.balanceOf(accounts[0])
BN {
  negative: 0,
  words: [ 1000000, <1 empty item> ],
  length: 1,
  red: null
}

Check Balance and Convert to BigNumber
- truffle(development)>> tokenInstance.balanceOf(accounts[0]).then(function(_balanceOfAdmin){balanceOfAdmin = _balanceOfAdmin;})

- truffle(development)>> balanceOfAdmin.toNumber()
1000000

- truffle(development)>> tokenInstance.balanceOf(accounts[1]).then(function(_balanceOfAccount1){balanceOfAccount1 = _balanceOfAccount1;})

- truffle(development)>> balanceOfAccount1.toNumber()
0

Transfer tokens to some other account
- truffle(development)>> tokenInstance.transfer(accounts[1], 1, {from: accounts[0]})

Check balance after transfer
truffle(development)> tokenInstance.balanceOf(accounts[1]).then(function(balance){balanceOfAccount1=balance;})
undefined


- truffle(development)> balanceOfAccount1.toNUmber()
1

Again transfer tokens to accounts[1]
- truffle(development)>> tokenInstance.transfer(accounts[1], 1, {from: accounts[0]})

Check balance after transfer 2
truffle(development)> tokenInstance.balanceOf(accounts[1]).then(function(balance){balanceOfAccount1=balance;})
undefined

- truffle(development)> balanceOfAccount1.toNUmber()
2


Check balance of accounts[0] after transfer 2
truffle(development)> tokenInstance.balanceOf(accounts[0]).then(function(balance){balanceOfAdmin=balance;})
undefined

- truffle(development)> balanceOfAdmin.toNUmber()
999998

Approve accounts[1] 100 tokens
truffle(development)> tokenInstance.approve(accounts[1], 100)   //By default fromAccount will be the first account of ganache accounts[0]

Check allowances
truffle(development)> tokenInstance.allowance(accounts[0], accounts[1]).then(function(allowance){allowances = allowance;})

- truffle(development)> allowances
BN {
  negative: 0,
  words: [ 100, <1 empty item> ],
  length: 1,
  red: null
}

- truffle(development)> allowances.toNumber()
100

TransferFrom
- truffle(development)> tokenInstance.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]})

- truffle(development)> tokenInstance.allowance(accounts[0], accounts[1]).then(function(allowance){allowances=allowance;})

- truffle(development)> allowances.toNumber()
50

Check Balance of accounts[2] after transferFrom
- truffle(development)> tokenInstance.balanceOf(accounts[2]).then(function(bal){balanceOfAccount2=bal;})
undefined

- truffle(development)> balanceOfAccount2.toNumber()
50




# Deploy contracts using Infura Rinkeby
- Infura website: https://infura.io/
- Login to Infura, and create project and copy  Network Endpoints. (https://rinkeby.infura.io/v3/12828434f45b4b759851ae73c37cfb5d)
- Make .env file to save MNEMONIC and ENDPOINT_KEY (.env is for not to expose to the public)
- Go to truffle-config.js file, add MNEMONIC and ENDPOINT_KEY (MNEMONIC is metamask private key)
- Install truffle HDWallet Provider: (npm install @truffle/hdwallet-provider)
- Install dotenv: (npm install dotenv --save)
- Add this to truffle-config.js file

  require("dotenv").config();
  const HDWalletProvider = require("@truffle/hdwallet-provider");

  const mnemonic = process.env.MNEMONIC;
  const tokenKey = process.env.ENDPOINT_KEY;

    /* Rinkeby Testnet */
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + tokenKey),
      network_id: 4,
      // gas : 6700000,
      // gasPrice : 10000000000,
      confirmations: 2,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

  - Migrate and deploythe contracts with Rinkeby testnet.
  
  $ truffle console --network rinkeby
  truffle(rinkeby)> truffle migrate --reset


# Deploying the Crowd Sale website

- Craete a folder "docs" whcih contains all "src files" and "json files" like we used bs-config.json file to take all the files to the root of our project and used for light-server as:
({
    "server":{
        "baseDir": ["./src", "./build/contracts"]
    }
})

- Make a srcipt that's going to take all the files that we want from the src and build/contracts and put those all in docs directory. (touch deployfronted.sh)

- Go to deployfronted.sh, and write script for synchronizing all the files.
rsync -r src/ docs/
rsync build/contracts/* docs/

- Make it to be executable. (chmod +x deployfronted.sh)

- Run the executable file: (./deployfronted.sh)

- Check the docs folder, and all the files from src/ and build/contracts/, that we wanted to be available

- Then, deploy it to github (write in deployfronted.sh file) as:
rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Compile assets for Github Pages"
git push -u origin master

- Then run the executable file (./deployfronted.sh)

# Set up the ICO Crowd Sale repository to serve pages for Github.

- Go to repository Settings, then go to Github Pages, and chosse "master branch/docs folder" to serve website. Then click Save button.

- Then check the website: https://rajeebkm.github.io/Crowd-Sale-ICO/






























