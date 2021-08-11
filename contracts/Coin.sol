// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Coin {
    address public minter ;
    mapping(address => uint) public balances;

    constructor() public {
        minter = msg.sender;
    }

    function mint(address reciever, uint amount) public {
        require(msg.sender == minter, "Only admin can transfer the fund!");
        balances[reciever] += amount;
    }

    function transfer(address sender ,address reciever, uint amount) public {
        require(amount < balances[sender], "Wow you are a bitch!");
        balances[reciever] += amount;
        balances[sender] -= amount; 
    }
}