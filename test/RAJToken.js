//Truffle comes with Mocha testing framework and chai assertion library, we can use both of things to run our tests.

//Importing contract files

var RAJToken = artifacts.require("./RAJToken.sol");

//Initialize test

contract('RAJToken', function(accounts){ 
    var tokenInstance;
    it('initializes the contract with correct values', function(){
        return RAJToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'RAJ Token', 'has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'RAJ', 'has the correct symbol');
        })
    })
    //passing RAJToken and callback function which gives us all the accounts that are available for testing to actually use those for our tests.
    it('allocates the initial supply upon deployment', function(){ 
        //The it() function defines a jasmine test. It is so named because its name makes reading tests almost like reading English. The second argument to the it() function is itself a function, that when executed will probably run some number of expect() functions. expect() functions are used to actually test the things you "expect" to be true
        return RAJToken.deployed().then(function(instance){
            tokenInstance = instance; //Assigne to variable tokenInstance
            return tokenInstance.totalSupply(); //promise chain
            //defined in our smart contract with getter function
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000'); //Check totalSupply is equal to the value we expect, so we can use the chai assertion library
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to admin account')
        });
    });


    it('transfers token ownership', function() {
        return RAJToken.deployed().then(function(instance) {
          tokenInstance = instance;
          // Test `require` statement first by transferring something larger than the sender's balance
          return tokenInstance.transfer.call(accounts[1], 99999999999999999999999); //Here, we didn't create transaction, just calling transfer function and checking require statements.
        }).then(assert.fail).catch(function(error) {
          assert(error.message.toString().indexOf('overflow') >= 0, 'error message must contain overflow');
          return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success) {
          assert.equal(success, true, 'it returns true');
          return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
          assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
          return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        });
      });

})

