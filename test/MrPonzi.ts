import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MrPonzy", function () {
 

  describe("Deployment", function () {
    it("Should set the right owner", async function () {

    });
  });

  describe("Play", function () {
    describe("Validations", function () {
      it("Should revert with the right error if send few ether", async function () {
   
      });
    });

    describe("Events", function () {
      it("Should emit an event on new MrPonzi", async function () {

      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the previous MrPonzi", async function () {
  
      });
    });
  });
  
  describe("Attack", function () {
    it("Should not be locked on revert for payment", async function () {
    })
  })
});
