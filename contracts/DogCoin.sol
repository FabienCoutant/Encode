// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DogCoin is ERC20 {
    address[] public holders;
    event addHolder(address holder);
    event removeHolder(address holder);

    constructor() ERC20("DogCoin", "DC") {
        _mint(msg.sender, 10 ether);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (balanceOf(to) == 0) {
            holders.push(to);
            emit addHolder(to);
        }
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (balanceOf(from) == 0) {
            for (uint256 i = 0; i < holders.length; i++) {
                if (holders[i] == from) {
                    if (i == holders.length - 1) {
                        holders.pop();
                    } else {
                        holders[i] = holders[holders.length - 1];
                        holders.pop();
                    }
                    emit removeHolder(from);
                    break;
                }
            }
        }
    }

    function getHolderArrayLength() public view returns (uint256) {
        return holders.length;
    }

    function isHolder(address account) external view returns (bool) {
        for (uint256 i; i < holders.length; i++) {
            if (account == holders[i]) {
                return true;
            }
        }
        return false;
    }
}
