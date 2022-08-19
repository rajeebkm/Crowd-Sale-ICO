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
          return tokenInstance.transfer.call(accounts[1], 99999999999999999999999); //Here, we didn't create transaction, just calling transfer function without writing to blockchain and checking require statements.
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

      it('approves token for delegated transfer', function(){
        return RAJToken.deployed().then(function(instance){
          tokenInstance = instance;
          return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
          assert.equal(success, true, 'it returns true');
          return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt){
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Approval', 'should be the the Approval event');
          assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
          assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
          assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer value');
          return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
          assert.equal(allowance, 100, 'stores the allowance for delegated transfer');
        });
      });


      it('handles delegate transfer', function(){
        return RAJToken.deployed().then(function(instance){
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];
          //Transfer some tokens to fromAccount
          return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt){
          //Approve spendingAccount to spend 10 tokens from fromAccount
          return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
          //Try transferring something larger than sender's balance
          return tokenInstance.transferFrom(fromAccount, toAccount, 999, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
          assert(error.message.toString().indexOf('revert') >= 0, 'cannot transfer value larger than balance');
          //Try transferring something larger than the approved amount
          return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
          assert(error.message.toString().indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
          return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(success){
          assert.equal(success, true, 'it returns true;');
          return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(receipt){
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event ');
          assert.equal(receipt.logs[0].args._from, accounts[2], 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, accounts[3], 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 10, 'logs the transferred amount');
          return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
          assert.equal(balance.toNumber(), 90, 'deducts the amount from sending account');
          return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
          assert.equal(balance.toNumber(), 10, 'adds the amount to the receiving account');
          return tokenInstance.allowance(accounts[2], accounts[4]);
        }).then(function(allowance){
          assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
      })

})

