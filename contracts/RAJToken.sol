//SPDX-License-Identifier:MIT
pragma solidity ^0.8.13;

contract RAJToken{
    //Constructor
    //Set the total number of token
    //Read the total number of token
    uint256 public totalSupply;

    // function RAJToken() public{
    //     totalSupply = 10000000;
    // }

    constructor(){
        totalSupply=10000000;
    }
}