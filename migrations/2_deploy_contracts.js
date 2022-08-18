// const RAJToken = artifacts.require("./RAJToken.sol"); File name
const RAJToken = artifacts.require("RAJToken"); //Contract name
//Craeting artifacts allows us to create a contract abstraction that truffle can use to run in a javascript runtime environment. Allows us to interact with our smart contract in javascript runtime environment like truffle console or when we are writing tests or when we are trying to interact the smart contract  with client side application.

module.exports = function (deployer) {
  deployer.deploy(RAJToken);
};
