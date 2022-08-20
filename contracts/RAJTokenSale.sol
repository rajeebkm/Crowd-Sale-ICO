//SPDX-License-Identifier:MIT
pragma solidity ^0.8.13;

import "./RAJToken.sol";

contract RAJTokenSale{

    //State Variables
    address admin;
    //Contract address of token (using contract data type)
    RAJToken public tokenContract;
    //Token price
    uint256 public tokenPrice;
    //TokensSold
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);


    constructor(RAJToken _tokenContract, uint256 _tokenPrice){
        //Asign an admin
        admin = msg.sender; //(msg is a global variable with sender means the address who deploys the contract)
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price
        tokenPrice = _tokenPrice;
    }

    //multiply (safeMath) https://github.com/dapphub/ds-math
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "multiply-overflow");
    }


    //Buy Tokens
    // this function should be payable as anyone can send Ether with this function during a transaction of buying tokens
    function buyTokens(uint256 _numberOfTokens) public payable{
        //Require that value is equal to tokenPrice. msg.value is the amount of wei that this function is sending while executing transaction.
        require(msg.value >= multiply(_numberOfTokens, tokenPrice), "Value is less than the number of tokens in wei");
        //Require that the contract has enough tokens
        require(_numberOfTokens <= tokenContract.balanceOf(address(this)), "Cannot purchase more tokens than available tokens.");
        //Require that a tranfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        //Keep track of tokenSold
        tokensSold += _numberOfTokens;
        //Trigger Sell Event
        emit Sell(msg.sender, _numberOfTokens);
    }

    //Ending RAJTokenSale
    // function endSale() public{
    //     //Require admin
    //     require(msg.sender == admin, "admin can end the sale");
    //     //Transfer remaining RAJTokens to the admin
    //     require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    //     //Destroy contract
    //     // selfdestruct(admin);

    //     // UPDATE: Let's not destroy the contract here
    //     // Just transfer the balance to the admin
    //     admin.transfer(address(this).balance);

    // }

     function endSale() public {
        //Require admin
        require(msg.sender == admin);

        //Transfer remaining tokens of the tokensale contract to the admin.
        // require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));

        //Destroy contract
        // selfdestruct(payable(admin));
        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        
    }
}