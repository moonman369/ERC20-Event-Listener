// Script to deploy ERC20 token contracts
const { ethers } = require("hardhat");

const latestContractIndex = 5;

async function deployContracts() {
  const [TokenContracts, contractInstances] = [new Array(), new Array()];

  return new Promise(async (resolve) => {
    const [deployer] = await ethers.getSigners();

    // Populating the TokenContracts with ContractFactory-s
    for (let i = 0; i <= latestContractIndex; i++) {
      TokenContracts.push(await ethers.getContractFactory(`Token${i}`));
    }

    // Populating the contractInstances array with deployed contract addresses
    let count = 0;
    for (let Contract of TokenContracts) {
      let instance = await Contract.connect(deployer).deploy(
        // Constructor Args
        `Token ${count}`, // Token Name
        `TKN${count}`, // Token Symbol
        10 ** 8 // Token Decimals
      );

      await instance.deployed();
      contractInstances.push(instance.address);
      count++;
    }
    resolve({ contracts: contractInstances }); // Resolving contractInstances array
  });
}

async function main() {
  // Calling deployContracts fn
  const { contracts } = await deployContracts();
  console.log("Contracts deployed at addresses: ");
  contracts.forEach((contract) => {
    console.log(contract);
  });
}

module.exports = {
  deployContracts,
};

main().catch((error) => {
  console.error(error);
});
