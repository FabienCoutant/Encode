// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Proposal {
    enum Stages {
        Proposed,
        Voting,
        Accepted,
        Rejected
    }

    Stages public stages;
    string public desc;
    address public admin;
    uint256 public acceptedCounter;
    uint256 public rejectedCounter;
    bool isAccepted;

    mapping(address => bool) public hasVoted;

    constructor(address _admin, string memory _desc) {
        admin = _admin;
        desc = _desc;
    }

    function vote(bool choice) public returns (bool) {
        require(stages == Stages.Voting, "Err!: wrong stages");
        require(!hasVoted[msg.sender], "Err!: already voted");
        hasVoted[msg.sender] = true;
        if (choice) {
            acceptedCounter++;
        } else {
            rejectedCounter++;
        }
        isAccepted = acceptedCounter > rejectedCounter ? true : false;
        return true;
    }

    function startVotingStage() public returns (bool) {
        require(stages == Stages.Proposed, "Err!: wrong stages");
        require(msg.sender == admin, "Auth!: not admin");
        stages = Stages.Voting;
        return true;
    }

    function result() public returns (bool) {
        require(stages == Stages.Voting, "Err!: wrong stages");
        require(msg.sender == admin, "Auth!: not admin");
        if (isAccepted) {
            stages = Stages.Accepted;
        } else {
            stages = Stages.Rejected;
        }
        return true;
    }
}
