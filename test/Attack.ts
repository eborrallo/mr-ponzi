import { MrPonzi } from './../typechain-types/MrPonzi';
import { Attack } from './../typechain-types/Attack';
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Attacker", function () {
  let contract: MrPonzi;
  let attacker: Attack;

  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("MrPonzi");
    contract = await contractFactory.deploy({ value: ethers.utils.parseEther("0.5") });

    const attackFactory = await ethers.getContractFactory("Attack");
    attacker = await attackFactory.deploy(contract.address);
  })

  describe("Run", function () {
    it("Should not be lock the victim on revert for payment", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();

      let transaction = attacker.connect(addr1).run({ value: ethers.utils.parseEther("1") })

      await expect(transaction)
        .to.emit(contract, "NewMrPonzy")
        .withArgs(attacker.address, ethers.utils.parseEther("1"));
      const twoEthers = ethers.utils.parseEther("2");


      transaction = addr2.sendTransaction({
        to: contract.address,
        value: twoEthers,
      });

      await expect(transaction)
        .to.emit(contract, "NewMrPonzy")
        .withArgs(addr2.address, twoEthers);
    })
  })
});
