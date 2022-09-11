// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token1 is ERC20, Ownable {

    constructor (
        string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply
    ) ERC20 (_name, _symbol) 
    {
        _mint(owner(), _totalSupply);
    }
}