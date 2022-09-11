// Script to deploy Dummy ERC721 token contract
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const NFT1 = await ethers.getContractFactory("NFT1");
  const nft1 = await NFT1.connect(deployer).deploy();
  await nft1.deployed();

  console.log(`Dummy NFT deployed to address: ${nft1.address}`);
}

main().catch((error) => {
  console.error(error.message);
});
