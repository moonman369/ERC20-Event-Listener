// Addresses for which logs must be fetched and displayed
let addresses = [
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "0x0165878A594ca255338adfa4d48449f69242Eb8F"
];

// Async `sleep()` funcion
const sleep = async (timeInMs) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({});
    }, timeInMs);
  });
};

// `On load` event handler
window.onload = async function () {
  // Checking for Metamask Provider
  if (window.ethereum) {

    // Initiating connect request
    const addresses = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(addresses)
    document.getElementById('address').textContent = addresses[0]

    // Check Chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    // Switching chain to localhost if different
    // if (chainId !== "0x7a69") {
    //   window.ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{chainId: '0x7a69'}]
    //   })
    // }

    console.log("Log Viewer is loaded");

    // Giving dynamic appearance to text-area
    document.getElementById("logs").textContent = `Listening for new events...`;
    await sleep(5000);
    document.getElementById(
      "logs"
    ).textContent = `No new events were detected. Fetching existing logs...`;

    // Creating a subscription for listener to detect new events
    await window.ethereum.request({
      id: 31337, // Hardhat chain id
      jsonrpc: 2, // JSON RPC version
      method: "eth_subscribe", // Method name
      params: [
        "logs",
        {
          address: addresses, // Array of addresses for which logs must be fetched. Not applicable for hardhat/ethers
          topics: [
            // 32bytes hash for Transfer event interface
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          ],
        },
      ],
    });
    await sleep(5000);
    // Calling `getLogs()` function to fetch all the existing logs
    await getLogs();
  } else {
    // Logging and displaying Install message if Metamask Provider not found
    document.getElementById("logs").textContent = `Please install Metamask.`;
    console.log("Please install Metamask.");
  }
};

// Actively listening for contract events using `ethereum.on()` function
window.ethereum.on(
  "message",
  /* Listener */ async (log) => {
    console.log("Event listener fired.");
    // Calling the `getLogs()` function
    await getLogs(0);
  }
);

// Async function for fetching and displaying event logs in the textarea
async function getLogs(indicator /* differenciates call contexts */) {
  // Display message to notify users that the getLogs function is running

  // Indicator helps in distinguishing the context of the fn call
  if (indicator == 0) {
    // Displays message if `getLogs()` was called from `ethereum.on()` context
    document.getElementById("logs").textContent =
      "New provider events detected!!! \nRefreshing Logs...";
    await sleep(3500);
  } else {
    document.getElementById("logs").textContent =
      "Please wait while we fetch the logs";
    await sleep(1500);
  }

  // Calling the `ethereum.request()` function and passing the Request args in JSON format
  let logs = await window.ethereum
    .request({
      id: 31337, // Hardhat chain id
      jsonrpc: 2, // JSON RPC version
      method: "eth_getLogs", // Method name
      params: [
        {
          fromBlock: "earliest", // Analogous to 0
          toBlock: "latest", // Last mined block
          address: addresses, // Array of addresses for which logs must be fetched. Not applicable for hardhat/ethers
          topics: [
            // 32bytes hash for Transfer event interface
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          ],
        },
      ],
    })
    // Catch block to handle exceptions
    .catch((error) => {
      // Logs and displays error message
      console.log(error.message);
      document.getElementById("logs").textContent = error.message;
    });

  // Checking if any matching logs were found
  if (logs.length > 0) {
    // Arranging logs by contract addresses and storing them in `resultJSON` object
    let textJSON = "";
    let resultJSON = {};

    // Creating `resultJSON` template
    for (let address of addresses) {
      resultJSON[address.toLowerCase()] = new Array();
    }

    // Sorting logs and pushing them to corresponding arrays
    for (let i = logs.length - 1; i >= 0; i--) {
      // Additional checks to filter out the possibility of potential bugs
      if (
        Object.keys(resultJSON).includes(logs[i].address) && // Checks if resultJSON.keys contains a log.address
        logs[i].topics.length == 3 // Checks if Topics list has length=3 (ERC20)
      ) {
        resultJSON[logs[i].address].push(logs[i]); // Pushing the logs object
      }
    }

    // Formatting the output string to make it more user readable
    for (let address of addresses) {
      // Fetching addresses and corresponding logs array from `resultJSON` object
      let logs = resultJSON[address.toLowerCase()];
      // Concatenating formatted string to textJSON
      textJSON += `ContractAddress: ${address}:\nLogCount: ${
        logs.length
      }\nLogs: \n${window.JSON.stringify(logs, null, 4)}\n\n\n`;
    }

    // Updating textContent of textarea element
    document.getElementById("logs").textContent = textJSON;
  } else {
    // In case no matching logs were found, displaying `Not found` message
    document.getElementById(
      "logs"
    ).textContent = `No matching logs were found.`;
  }
}

// Event listener for `click` event on `view logs` button
document.getElementById("viewLogs").addEventListener(
  "click",
  /* Handler function */ async () => {
    // Displaying buffer text
    document.getElementById("logs").textContent = "Fetching old logs...";
    await sleep(2000);
    // Calling `getLogs` fn
    await getLogs();
  }
);

document.getElementById("setChain").addEventListener('click', async () => {
  const chain = `0x${Number(document.querySelector(".chain_id_input").value).toString(16)}`
  console.log(chain)
  window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{chainId: chain}]
  })
})
