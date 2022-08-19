//SPDX-License-Identifier:MIT
pragma solidity ^0.8.13;

contract RAJToken{
    //Name
    string public name;
    //Symbol
    string public symbol;
    
    //Constructor
    //Set the total number of token
    //Read the total number of token
    uint256 public totalSupply;

    // function RAJToken() public{
    //     totalSupply = 10000000;
    // }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply){
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
    }

    //Keep track of balances of each amount, mapping is like an associative array (Key value store)
    mapping(address => uint256) public balanceOf;

    //Transfer
    function transfer(address _to, uint256 _value) public returns(bool success){
    //Exception if account doen't have enough value
    require(balanceOf[msg.sender] >= _value, "Sender doesn't have sufficient balance");
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    //Trigers Transfer event
    emit Transfer(msg.sender, _to, _value);
    //Returns a boolean
    return true;
    }

}