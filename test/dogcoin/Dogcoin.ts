import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { DogCoin } from "../../src/types";
import { Signers } from "../types";

describe("DogCoin", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.paul = signers[1];
    this.signers.alice = signers[2];
  });

  describe("DogCoin", function () {
    beforeEach(async function () {
      const dogcoinArtifact: Artifact = await artifacts.readArtifact("DogCoin");
      this.dogcoin = <DogCoin>await waffle.deployContract(this.signers.admin, dogcoinArtifact);
    });

    it("Should deploy and set the admin as holder", async function () {
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.admin.address)).to.true;

      expect(await this.dogcoin.connect(this.signers.admin).holders(0)).to.equal(this.signers.admin.address);
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(1);
    });
    it("Should add new holder if the address that receive fund is not already a holder", async function () {
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.false;
      const receipt = await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.true;
      expect(await this.dogcoin.connect(this.signers.admin).holders(1)).to.equal(this.signers.paul.address);
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(2);
      await expect(receipt).to.emit(this.dogcoin, "addHolder").withArgs(this.signers.paul.address);
    });

    it("Should not add new holder if the address that receive fund is already a holder", async function () {
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      const receipt = await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.true;
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(2);
      expect(await this.dogcoin.connect(this.signers.admin).holders(1)).to.equal(this.signers.paul.address);
      await expect(receipt).to.not.emit(this.dogcoin, "addHolder");
    });
    it("Should remove an holder that not longer have funds", async function () {
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.true;
      const paulBalance = await this.dogcoin.connect(this.signers.admin).balanceOf(this.signers.paul.address);
      const receipt = await this.dogcoin.connect(this.signers.paul).transfer(this.signers.admin.address, paulBalance);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.false;
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(1);
      await expect(receipt).to.emit(this.dogcoin, "removeHolder").withArgs(this.signers.paul.address);
    });

    it("Should remove correctly the holder if it's the last one of the array", async function () {
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.alice.address, 1);
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(3);

      const aliceBalance = await this.dogcoin.connect(this.signers.admin).balanceOf(this.signers.alice.address);
      const receipt = await this.dogcoin.connect(this.signers.alice).transfer(this.signers.admin.address, aliceBalance);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.alice.address)).to.false;
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(2);
      await expect(receipt).to.emit(this.dogcoin, "removeHolder").withArgs(this.signers.alice.address);
    });

    it("Should remove correctly the holder in the middle of the array", async function () {
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.paul.address, 1);
      await this.dogcoin.connect(this.signers.admin).transfer(this.signers.alice.address, 1);
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(3);

      const paulBalance = await this.dogcoin.connect(this.signers.admin).balanceOf(this.signers.paul.address);
      const receipt = await this.dogcoin.connect(this.signers.paul).transfer(this.signers.admin.address, paulBalance);
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.paul.address)).to.false;
      expect(await this.dogcoin.connect(this.signers.admin).isHolder(this.signers.alice.address)).to.true;
      expect(await this.dogcoin.connect(this.signers.admin).getHolderArrayLength()).to.equal(2);
      await expect(receipt).to.emit(this.dogcoin, "removeHolder").withArgs(this.signers.paul.address);
    });
  });
});
