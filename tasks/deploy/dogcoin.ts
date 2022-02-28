import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { DogCoin } from "../../src/types";
import { DogCoin__factory } from "../../src/types";

task("deploy:DogCoin").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const dogcoinFactory: DogCoin__factory = <DogCoin__factory>await ethers.getContractFactory("DogCoin");
  const dogcoin: DogCoin = <DogCoin>await dogcoinFactory.deploy();
  await dogcoin.deployed();
  console.log("DogCoin deployed to: ", dogcoin.address);
});
