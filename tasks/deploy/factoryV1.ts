import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { FactoryV1, FactoryV1__factory } from "../../src/types";

task("deploy:FactoryV1").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const FactoryV1: FactoryV1__factory = <FactoryV1__factory>await ethers.getContractFactory("FactoryV1");
  const factoryV1: FactoryV1 = <FactoryV1>await FactoryV1.deploy();
  await factoryV1.deployed();
  console.log("Factory deployed to: ", factoryV1.address);
});
