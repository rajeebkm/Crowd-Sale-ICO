// const RAJToken = artifacts.require("./RAJToken.sol"); File name
const RAJToken = artifacts.require("RAJToken"); //Contract name
//Craeting artifacts allows us to create a contract abstraction that truffle can use to run in a javascript runtime environment. Allows us to interact with our smart contract in javascript runtime environment like truffle console or when we are writing tests or when we are trying to interact the smart contract  with client side application.
const RAJTokenSale = artifacts.require("RAJTokenSale");

module.exports = function (deployer) {
  //deployer function can take several argument like contract abstraction, constructor arguments etc.
  deployer.deploy(RAJToken, 'RAJ Token', 'RAJ', 1000000).then(function() {  //deployer.deploy() is a asynchronous function and it returns a promise, so we can to use promise chain here
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(RAJTokenSale, RAJToken.address, tokenPrice);
});
}
