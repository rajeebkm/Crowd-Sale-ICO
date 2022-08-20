const RAJToken = artifacts.require("RAJToken");
const RAJTokenSale = artifacts.require("RAJTokenSale");

contract('RAJTokenSale', function(accounts){
    //Declare token instance
    var tokenInstance;
    //Declare RAJTokenSale instance to track of this throughout promise chain
    var tokenSaleInstance;
    //Declare tokenPrice
    var tokenPrice = 1000000000000000; //in wei (0.01 ETH, 1ETH = 10^18 wei)
    var admin = accounts[0];
    var buyer = accounts[1];
    //Tokens Available
    var tokensAvailable = 750000; // (75 % of 1 million initial supply)
    //Number of Tokens
    var numberOfTokens;

    it('initializes the contract with the correct values', function(){
        //returning an instance of deployed contract
        return RAJTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address,0x0, 'has contract address');
            //Reference to the RAJToken exists within the RAJTokenSale contract (by checking RAJToken address within RAJTokenSale contract)
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address,0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });


    it('facilitates token buying', function(){
        return RAJToken.deployed().then(function(instance){
            //Grab token instance first
            tokenInstance = instance;
            return RAJTokenSale.deployed();
        }).then(function(instance){
            //Then grab token sale instance
            tokenSaleInstance = instance;
            //Provision 75% of all tokens to the token sale contract
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        }).then(function(receipt){
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');      
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');

            return tokenSaleInstance.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            //Try to buy tokens different from the ether value.
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei'); 
            //message inside comment 'msg.value must equal number of tokens in wei', is returned if there is no any kind of failure. If failure there, it should pass the test case. For that we will check require() statement in function buyTokens().
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice});
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert') >= 0, 'cannot purchase more tokens than available.');

        });
    });

    it('ends token sale', function(){
        return RAJToken.deployed().then(function(instance){
            //Grab token instance first
            tokenInstance = instance;
            return RAJTokenSale.deployed();
        }).then(function(instance){
            //Then grab token sale instance
            tokenSaleInstance = instance;
            //Try to end sale from an account other than admin
            return tokenSaleInstance.endSale({from: buyer});
    }).then(assert.fail).catch(function(error){
        assert(error.message.toString().indexOf('revert') >= 0, 'must be admin to end sale');
        //End sale as admin
        return tokenSaleInstance.endSale({from: admin});
    }).then(function(receipt){
        return tokenInstance.balanceOf(admin);
    }).then(function(balance){
        assert.equal(balance.toNumber(), 999990, 'transfer to the admin');
        return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance){
        assert.equal(balance.toNumber(), 0, 'transfer all tokens from tokensale address to the admin');
        //Check that token price was reset when selfDestruct wad called. (solidty version ^0.4.2. It's not working in current version with selfdestruct)
    //     return tokenSaleInstance.tokenPrice();
    // }).then(function(price){
    //     assert.equal(price.toNumber(), 0, 'token price was reset.');
    // });

});

});

})
