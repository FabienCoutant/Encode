// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "./Proposal.sol";

contract FactoryV1 {
    Proposal[] deployedProposal;
    address admin;

    constructor() {
        admin = msg.sender;
    }

    function deployProposal(string calldata desc) public returns (Proposal) {
        require(msg.sender == admin);
        Proposal newProposal = new Proposal(msg.sender, desc);
        deployedProposal.push(newProposal);
        return newProposal;
    }

    function getDeployedProposals() public view returns (Proposal[] memory) {
        return deployedProposal;
    }

    function getDeployedProposal(uint256 index) public view returns (Proposal) {
        return deployedProposal[index];
    }
}
