// Script to generate txns (mint and transfers for both ERC20 and ERC721 contracts)
const { ethers } = require("hardhat");

// Importing ERC20 and ERC721 ABIs from artifacts directory
const ERC20 = require("../artifacts/contracts/ERC20-Token_0.sol/Token0.json");
const ERC721 = require("../artifacts/contracts/ERC721-Dummy.sol/NFT1.json");

// Predefined hardhat contract addresses
const contracts = [
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
];

const nftAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

// Initializing provider object for Hardhat Localhost Network
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

async function main() {
  // Getting hardhat signers for generating txns
  const [...addrs] = await ethers.getSigners();

  // Storing contract instances in an array
  const instances = new Array();
  for (let contract of contracts) {
    instances.push(
      new ethers.Contract(
        contract,
        ERC20.abi,
        provider
      ) /* creating contract instances with address, abi, provider */
    );
  }

  // Miscellaneous transactions
  await instances[0].connect(addrs[0]).transfer(addrs[1].address, 100);
  await instances[1].connect(addrs[0]).transfer(addrs[2].address, 100);
  await instances[2].connect(addrs[0]).transfer(addrs[3].address, 100);
  await instances[3].connect(addrs[0]).transfer(addrs[4].address, 100);
  await instances[4].connect(addrs[0]).transfer(addrs[5].address, 100);
  await instances[5].connect(addrs[0]).transfer(addrs[6].address, 100);

  await instances[2].connect(addrs[0]).transfer(addrs[7].address, 100);
  await instances[4].connect(addrs[0]).transfer(addrs[8].address, 100);
  await instances[0].connect(addrs[0]).transfer(addrs[2].address, 100);
  await instances[5].connect(addrs[0]).transfer(addrs[5].address, 100);
  await instances[1].connect(addrs[0]).transfer(addrs[9].address, 100);
  await instances[3].connect(addrs[0]).transfer(addrs[4].address, 100);

  const nft1 = new ethers.Contract(nftAddress, ERC721.abi, provider);
  await nft1.connect(addrs[0]).mintItem(addrs[0].address);
  await nft1.connect(addrs[0]).mintItem(addrs[1].address);

  console.log(await instances[0].balanceOf(addrs[0].address));
}

main().catch((error) => {
  console.error(error.message);
});
