import { expect } from "chai";
import { upgrades, ethers } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Signers } from "../types";

describe("DogCoinUpgradeable", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.paul = signers[1];
    this.signers.alice = signers[2];
  });

  describe("DogCoin", function () {
    beforeEach(async function () {
      const DogCoinV1Factory = await ethers.getContractFactory("DogCoinV1");
      this.proxy = await upgrades.deployProxy(DogCoinV1Factory, {
        kind: "uups",
        initializer: "initialize",
      });
    });

    it("Should deploy", async function () {
      expect(await this.proxy.connect(this.signers.admin).isHolder(this.signers.admin.address)).to.true;
    });
    it("Should upgrade", async function () {
      const DogCoinV2Factory = await ethers.getContractFactory("DogCoinV2");
      const dogcoinV2 = await upgrades.upgradeProxy(this.proxy, DogCoinV2Factory);
      expect(await dogcoinV2.connect(this.signers.admin).version()).to.equal("v2");
    });
  });
});
