// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MrPonzi {
    address payable mrPonzi;
    uint public prize;
    address payable public owner;

    event NewMrPonzy(address newMrPonzi, uint prize);

    constructor() payable {
        owner = payable(msg.sender);
        mrPonzi = payable(msg.sender);
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner, 'Error , very little ether sent');
        (bool success, ) = mrPonzi.call{value: msg.value}("");
        mrPonzi = payable(msg.sender);
        prize = msg.value;

        emit NewMrPonzy(address(msg.sender), prize);
    }

    function _mrPonzi() public view returns (address payable) {
        return mrPonzi;
    }
}
