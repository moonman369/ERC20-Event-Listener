// NodeJS script for listening to provider events and fetching logs for given contracts
const { ethers } = require("hardhat");
const { createFilter } = require("./utils");

async function main() {
  // Declaring and initializing `provider` object for hardhat localhost network
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  // Contract addresses for which logs must be fetched
  const toWatch = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    // "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  ];

  // Creating filter for provider event listener function call
  const filter = createFilter(
    // Hardhat ethers RPC API does not support filtering of logs for multiple contract addresses.
    // The `address` arg takes either null (no filter) or a single string (only one address)
    // [
    //   "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    //   "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    // ],
    null, // Passing null to listen to `all` events
    0, // from block
    provider.getBlockNumber("latest"), // to block
    [`Transfer(address,address,uint256)`] // topics list (only consists of Event interface, to be converted into bytes32 hash before passing through `provider.on()` fn)
  );

  provider.on(filter, async (logs) => {
    console.log(logs);
    let logslist;
    // Checking if topic list has length=3 (Proof of ERC20) AND `toWatch` contains address
    if (logs.topics.length == 3 && toWatch.includes(logs.address)) {
      // Creating filter for fetching logs of a given contract
      let filter = await createFilter(
        logs.address, // Address of the event log that passes the check
        0, // from block
        provider.getBlockNumber("latest"), // to block
        [`Transfer(address,address,uint256)`] // topics list
      );
      // `provider.getLogs()` fetches all filtered logs and stores it in logslist
      logslist = await provider.getLogs(filter);
      // Logs the logslist to the NodeJS terminal
      console.log(logslist, `\n\n\n`);
    }
  });
}

main().catch((error) => {
  console.error(error.message);
});
