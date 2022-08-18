//Truffle comes with Mocha testing framework and chai assertion library, we can use both of things to run our tests.

//Importing contract files

var RAJToken = artifacts.require("./RAJToken.sol");

//Initialize test

contract('RAJToken', function(accounts){ 
    //passing RAJToken and callback function which gives us all the accounts that are available for testing to actually use those for our tests.
    it('sets the total supply upon deployment', function(){ 
        //The it() function defines a jasmine test. It is so named because its name makes reading tests almost like reading English. The second argument to the it() function is itself a function, that when executed will probably run some number of expect() functions. expect() functions are used to actually test the things you "expect" to be true
        return RAJToken.deployed().then(function(instance){
            tokenInstance = instance; //Assigne to variable tokenInstance
            return tokenInstance.totalSupply(); //promise chain
            //defined in our smart contract with getter function
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 10000000, 'sets the total supply to 1,000,000');  //Check totalSupply is equal to the value we expect, so we can use the chai assertion library
        });
    });

})

