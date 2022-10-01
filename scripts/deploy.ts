import { ethers } from "hardhat";

async function main() {


  const lockedAmount = ethers.utils.parseEther("1");

  const Factory = await ethers.getContractFactory("MrPonzi");
  const contract = await Factory.deploy( { value: lockedAmount });

  await contract.deployed();

  console.log(`Mr Ponzi with 1 ETH deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
