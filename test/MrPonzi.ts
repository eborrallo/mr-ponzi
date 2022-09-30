import { MrPonzi } from './../typechain-types/MrPonzi';
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MrPonzy", function () {
  let contract: MrPonzi;
  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("MrPonzi");
    contract = await contractFactory.deploy({ value: ethers.utils.parseEther("1") });
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const [owner, addr1] = await ethers.getSigners();
      const _owner = await contract.owner()

      expect(_owner).to.be.equals(owner.address)
    });
  });

  describe("Play", function () {
    describe("Validations", function () {
      it("Should revert with the right error if send less tha 1.5 times the actual ether", async function () {

        const [owner, addr1] = await ethers.getSigners();

        const transaction = addr1.sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther("1.4"),
        });

        await expect(transaction).to.be.revertedWith('Error , very little ether sent')
      });
    });

    describe("Events", function () {
      it("Should emit an event on new MrPonzi", async function () {

        const [owner, addr1] = await ethers.getSigners();

        const twoEthers = ethers.utils.parseEther("2")
        const transaction = addr1.sendTransaction({
          to: contract.address,
          value: twoEthers,
        });

        await expect(transaction)
          .to.emit(contract, "NewMrPonzi")
          .withArgs(addr1.address, twoEthers);
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the previous MrPonzi", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const beforeFundsAddress2 = await addr1.getBalance()
        const twoEthers = ethers.utils.parseEther("2")
        let transaction = addr1.sendTransaction({
          to: contract.address,
          value: twoEthers,
        });


        await expect(transaction)
          .to.emit(contract, "NewMrPonzi")
          .withArgs(addr1.address, twoEthers);

        const threeEthers = ethers.utils.parseEther("3")
        transaction = addr2.sendTransaction({
          to: contract.address,
          value: threeEthers,
        });

        await expect(transaction)
          .to.emit(contract, "NewMrPonzi")
          .withArgs(addr2.address, threeEthers);

        const afterFundsAddress2 = await addr1.getBalance()
        expect(afterFundsAddress2).to.be.greaterThan(beforeFundsAddress2)
      });
    });
  });
});
