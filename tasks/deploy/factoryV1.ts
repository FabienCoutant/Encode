import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Factory, Factory__factory } from "../../src/types";

task("deploy:FactoryV1").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const FactoryV1: Factory__factory = <Factory__factory>await ethers.getContractFactory("FactoryV1");
  const factoryV1: Factory = <Factory>await FactoryV1.deploy();
  await factoryV1.deployed();
  console.log("Factory deployed to: ", factoryV1.address);
});
