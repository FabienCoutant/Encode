import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { Proposal } from "../../src/types";
import { Signers } from "../types";

describe("Propsal", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.paul = signers[1];
    this.signers.alice = signers[2];
  });

  describe("Proposal", function () {
    beforeEach(async function () {
      const proposalArtifact: Artifact = await artifacts.readArtifact("Proposal");
      this.proposal = <Proposal>(
        await waffle.deployContract(this.signers.admin, proposalArtifact, [this.signers.admin.address, "test"])
      );
    });

    it("Should deploy and set the admin as admin and right desc", async function () {
      expect(await this.proposal.connect(this.signers.admin).admin()).to.equal(this.signers.admin.address);
      expect(await this.proposal.connect(this.signers.admin).desc()).to.equal("test");
    });
    it("Should vote() revert if not voting stages", async function () {
      await expect(this.proposal.connect(this.signers.admin).vote(true)).to.revertedWith("Err!: wrong stages");
    });
    it("Should vote() true", async function () {
      await this.proposal.connect(this.signers.admin).startVotingStage();
      await this.proposal.connect(this.signers.admin).vote(true);
      expect(await this.proposal.connect(this.signers.admin).acceptedCounter()).to.equal(1);
      expect(await this.proposal.connect(this.signers.admin).rejectedCounter()).to.equal(0);
    });
    it("Should vote() false", async function () {
      await this.proposal.connect(this.signers.admin).startVotingStage();
      await this.proposal.connect(this.signers.admin).vote(false);
      expect(await this.proposal.connect(this.signers.admin).acceptedCounter()).to.equal(0);
      expect(await this.proposal.connect(this.signers.admin).rejectedCounter()).to.equal(1);
    });
    it("Should startVotingStage() revert if not admin change stage", async function () {
      await expect(this.proposal.connect(this.signers.paul).startVotingStage()).to.revertedWith("Auth!: not admin");
    });
    it("Should startVotingStage() revert if not stage already pass ", async function () {
      await this.proposal.connect(this.signers.admin).startVotingStage();
      await expect(this.proposal.connect(this.signers.admin).startVotingStage()).to.revertedWith("Err!: wrong stages");
    });
    it("Should revert if not stage already pass ", async function () {
      await this.proposal.connect(this.signers.admin).startVotingStage();
      await expect(this.proposal.connect(this.signers.admin).startVotingStage()).to.revertedWith("Err!: wrong stages");
    });
  });
});
