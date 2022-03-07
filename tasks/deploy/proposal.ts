import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Proposal, Proposal__factory } from "../../src/types";

task("deploy:DogCoin")
  .addParam("desc", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const accounts = await ethers.getSigners();
    const proposalFactory: Proposal__factory = <Proposal__factory>await ethers.getContractFactory("Proposal");
    const proposal: Proposal = <Proposal>await proposalFactory.deploy(accounts[0].address, taskArguments.desc);
    await proposal.deployed();
    console.log("Proposal deployed to: ", proposal.address);
  });
