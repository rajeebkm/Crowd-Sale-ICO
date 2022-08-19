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
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply){
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
    }

    //Keep track of balances of each amount, mapping is like an associative array (Key value store)
    mapping(address => uint256) public balanceOf;
    //Check allowance between owner and spender
    mapping(address => mapping(address => uint256)) public allowance;

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


    //approve
    function approve(address _spender, uint256 _value) public returns(bool success){
        //allowance
        allowance[msg.sender][_spender] = _value;

        //Approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    //transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        //require _from has enough tokens
        require(balanceOf[_from] >= _value, "fromAccount hasn't enough balance");
        //require allowance is big enough
        require(allowance[_from][msg.sender] >= _value, "No allowances");
        //change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //update the balance
        allowance[_from][msg.sender] -=_value;
        //Transfer event
        emit Transfer(_from, _to, _value);
        //returns a boolean
        return true;
    }

}