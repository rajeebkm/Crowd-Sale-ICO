App = {
    web3Provider: null,  //initially set to null
    contracts: {},  //keep trackof contracts
    account: '0x0', //default value
    loading: false, //keep track of loading state
    tokenPrice: 1000000000000000,  //default value in wei
    tokensSold: 0, //starts from 0 token sold.
    tokensAvailable: 750000,


    init: function(){
        console.log("App initialized...");
        //return initWeb3
        return App.initWeb3();
    },

    //Instantiate web3, which is a javascript library that we use to get our client side application (front-end) to talk to the blockchain. It is basically allow our app to communicate to the blockchain, when it's deployed to a web server or on a local machine.
    // When our App is loaded, initWeb3 will initialized.
    //Essentialy web3 is depends upon Http provider, that's going to be provided by the metamask. MetaMask is a browser extension that turns our modern browser to a blockchain (web3) browser, as bydefault most browsers won't talk to the blockchain. MetaMask is used to inject a Http provider into our browser that allows our browser to talk to our client side application which talks to the blockchain.

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = ethereum;  //web3.currentProvider is replaced by ethereum
            web3 = new Web3(ethereum); //web3.currentProvider is replaced by ethereum
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts();
    },

    //Initialize our smart contracts
    initContracts: function() {
        //get contract abstraction (.json representation of our smart contracts with abi application binary interface that describes how the contract works). TruffleContract library is used to interpret abi for EVM to allow the contract encode and decode. 
        //(bs-config exposed our files to the root of our project. so we mentioned "RAJTokenSale.json" instead of "build/contracts/RAJTokenSale.json")
        $.getJSON("RAJTokenSale.json", function(rajTokenSale){
            App.contracts.RAJTokenSale = TruffleContract(rajTokenSale); 
            //we pulled TruffleContract in dependencies. It gives us nice functionality to read our contracts and interact with them. We can also interact to smart contracts with the help of web3 (taking abi in json), but we can get lots of things with truffle, it understands entire json file, and also helpful when we try to deploy this project to a different network as TruffleContract knows how to read these different networks, we can know the address depending on where we deploy our smart contract and we don't have to keep a copy and pasting values or using some sort of environment variables.
            
            //Here we create an abstraction that allow us to interact with RAJTokenSale contract, with the help of TruffleContract in a very simple and streamlined way.

            //Set provider as App.web3Provider
            App.contracts.RAJTokenSale.setProvider(App.web3Provider);

            //Create deployed instance of the contract
            App.contracts.RAJTokenSale.deployed().then(function(rajTokenSale){
                console.log("RAJ Token Sale Address: ", rajTokenSale.address); 
                //We have to connect to the Custom RPC in MetaMask by importing private keys from ganache.
            });
            //We also need RAJToken token contract as well. We can do this by promise chain.
        }).done(function(){
            $.getJSON("RAJToken.json", function(rajToken){
                App.contracts.RAJToken = TruffleContract(rajToken);
                App.contracts.RAJToken.setProvider(App.web3Provider);
                App.contracts.RAJToken.deployed().then(function(rajToken){
                console.log("RAJ Token Address: ", rajToken.address);
            });
        });
        App.listenForEvents();
        return App.render();
    })
},

    //Listen for events emitted from the contract
    listenForEvents: function(){
        App.contracts.RAJTokenSale.deployed().then(function(instance){
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: "latest",
            }).watch(function(error, event){
                console.log("events triggered", event);
                App.render();
            })
        })
    },

    //Create a render function to show all these function in our client side application.
    render: function(){
        //Keep track of loading state, to prevent the double loading error. If App is loading, we don't want don't want double render or anything, exit this function
        if(App.loading){
            return;
        }

        App.loading = true; 
        //When App is loading, we will show the loader and hide the content

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        //Load account data
        //Show the accounts or get access to the accounts that we are connected to.
        //Callback function that is accepted by getCoinbase() function.
        web3.eth.getCoinbase(function(err, account){
            //if there is no error
            if(err === null){
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
                //(Here in above line we are querying for the account address on the DOM)
            }

        })

        //Grab/fetch the RAJTokenSale contract like our testcase
        //Load RAJTokenSale contract
        App.contracts.RAJTokenSale.deployed().then(function(instance){
            rajTokenSaleInstance = instance;
            return rajTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice;
            //Show token price in frontend. We need to show the price in Ether by using web3 library (web3.fromWei()).
            $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
            //Show token sold
            return rajTokenSaleInstance.tokensSold();
        }).then(function(tokensSold){
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            //Update progress bar
            var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
            $('#progress').css("width", progressPercent + "%");

            //Load RAJToken contract
            App.contracts.RAJToken.deployed().then(function(instance){
                rajTokenInstance = instance;
                return rajTokenInstance.balanceOf(App.account);
            }).then(function(balance){
                $('.raj-balance').html(balance.toNumber());
                //When all the asynchronous processes are done, we want to tell the App not loading anymore (make it to false). We will hide the loader and show the content.
                //This will work correctly, whenever we actually pull all the data from our contracts
                App.loading = false;
                loader.hide();
                content.show();
            })
        });

    },

    //Buy RAJToken
    buyTokens: function(){
        //Hide the content, show the loader
        $('#content').hide();
        $('#loader').show();
        //number of tokens
        var numberOfTokens = $('#numberOfTokens').val();
        //interact with contract and create a transaction
        App.contracts.RAJTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice, //send amount of ether in wei
                gas: 500000 //gaslimit
            }); 
            //passing number of tokens and some metadat
        }).then(function(result){
            console.log("Tokens bought...");
            $('form').trigger('reset'); //reset number of tokens in form
            // //Hide the content, show the loader
            // $('#loader').hide();
            // $('#content').show();

            //Wait for Sell event
        });

    }

}

//Initialize App, whenever our window loads
$(function(){
    $(window).load(function(){
        App.init();
        
    })
});
