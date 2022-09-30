// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MrPonzi {
    address payable public mrPonzi;
    uint public prize;
    address payable public owner;

    event NewMrPonzi(address newMrPonzi, uint prize);

    constructor() payable {
        owner = payable(msg.sender);
        mrPonzi = payable(msg.sender);
        prize = msg.value;
    }

    function payableCriteria(uint value) private returns (bool){

        return value >= (prize + (prize / 2));
    }

    receive() external payable {
        require(payableCriteria(msg.value) || msg.sender == owner, 'Error , very little ether sent');
        (bool success,) = mrPonzi.call{value : msg.value}("");
        mrPonzi = payable(msg.sender);
        prize = msg.value;

        emit NewMrPonzi(address(msg.sender), prize);
    }

    function _mrPonzi() public view returns (address payable) {
        return mrPonzi;
    }
}
