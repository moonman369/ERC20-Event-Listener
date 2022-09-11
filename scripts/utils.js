// Script containing important functions required to acquire the final result
const { ethers } = require("hardhat");

// Function to encapsulate `ethers.hexZeroPad()` fn
// This is done to make it callback compatible with `map()` fn
function hexZeroPad32(string) {
  if (string == "") return null;
  // Pads a string with leading zeroes to 32 spaces
  return ethers.utils.hexZeroPad(string, 32);
}

// Async function to make execution wait for given time (in milliseconds)
const sleep = (timeInMs) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({});
    }, timeInMs);
  });
};

// Function that creates a filter object that can be passed to `provider.on()` or `provider.getLogs()` functions
async function createFilter(
  _contractAddress,
  _fromBlock,
  _toBlock,
  _topicsList
) {
  // Extracting first topic as it is the Event Interface and must be hashed separately
  let topicZero = _topicsList.shift();
  return {
    fromBlock: _fromBlock,
    toBlock: _toBlock,
    address: _contractAddress,
    topics: [
      ethers.utils.id(topicZero),
      ..._topicsList.map(
        hexZeroPad32
      ) /* Uses padded versions of subsequent topics */,
    ],
  };
}

// Exporting all the functions to be used by other scripts
module.exports = {
  sleep,
  hexZeroPad32,
  createFilter,
};
