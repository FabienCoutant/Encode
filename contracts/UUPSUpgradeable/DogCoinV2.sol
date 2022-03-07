// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./DogCoinV1.sol";

contract DogCoinV2 is DogCoinV1 {
    function version() external view returns (string memory) {
        return "v2";
    }
}
