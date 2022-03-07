import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("deploy:dogcoinUUPS").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const DogCoinV1Factory = await ethers.getContractFactory("DogCoinV1");
  const proxy = await upgrades.deployProxy(DogCoinV1Factory, {
    kind: "uups",
    initializer: "initialize",
  });
  console.log(`Deploy DogCoin Proxy done -> ${proxy.address}`);

  const DogCoinV2Factory = await ethers.getContractFactory("DogCoinV2");
  const dogcoinV2 = await upgrades.upgradeProxy(proxy, DogCoinV2Factory);
  console.log(`Deploy dogcoinV2 done -> ${dogcoinV2.address}`);
});
