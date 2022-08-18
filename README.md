# Crowd Sale ICO

### Steps

- truffle init
- Write smart sontrat in contracts folder
- Edit truffle-config.js file
- Edit/Add migrations file
- ganache-cli (Local blockchain for accounts)

Javascript runtime environment
- truffle console  

To compile and migrate our contract
- truffle(development)>> truffle migrate --reset 

To deploy and create intance of contract and then assign the value of the instance to a variable 'token'
- truffle(development)>> RAJToken.deployed().then(function(i){
    token = i;
})

Because of asynchronous nature of our smart contracts, developing them relies heavily upon javascript promises. Javascript promises are basically a way of handling the eventual result of asynchronous application. Here deploy() will going to return a promise, whenever this promise is finished, then call the then() function, that going to accept a callback function, then set the return value, which is going to get the deployed instance of contract and set it to token variable.

- truffle(development)>> token.address
-- '0x4357B32550DA07CBd337546C3B0A7845311Ec6B9'

- truffle(development)>> token.totalSupply()
BN {
  negative: 0,
  words: [ 10000000, <1 empty item> ],
  length: 1,
  red: null
}

- truffle(development)>> token.totalSupply().then(function(s){
    totalSupply = s;
})
undefined

- truffle(development)>> totalSupply

BN {
  negative: 0,
  words: [ 10000000, <1 empty item> ],
  length: 1,
  red: null
}

- truffle(development)>> totalSupply.toNumber()
10000000

- truffle(development)>> .exit  (To exit from the console)

## Testing


- touch test/RAJToken.js

Write test cases in RAJToken.js file.

## Initialize git

- git init
- git status







