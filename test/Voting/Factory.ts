import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { FactoryV1 as Factory } from "../../src/types";
import { Signers } from "../types";

describe("Factory", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.paul = signers[1];
    this.signers.alice = signers[2];
  });

  describe("Factory", function () {
    beforeEach(async function () {
      const factoryArtifact: Artifact = await artifacts.readArtifact("FactoryV1");
      this.factory = <Factory>await waffle.deployContract(this.signers.admin, factoryArtifact);
    });

    it("Should deploy a new Proposal", async function () {
      await this.factory.connect(this.signers.admin).deployProposal("test");
      const deployedProposal = await this.factory.connect(this.signers.admin).getDeployedProposals();
      expect(deployedProposal.length).to.equal(1);
    });
  });
});
