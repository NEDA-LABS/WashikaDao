// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
//import "../src/DaoContract.sol";
//import "../src/FullDaoContract.sol";
import "../src/WashikaDao.sol";

contract CounterScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("ARB_PRIVATE_KEY");
        address owner = vm.addr(privateKey);
        console.log(owner);
        vm.startBroadcast(privateKey);
        WashikaDao washikaDao = new WashikaDao(); //No Contract constructor args needed
        console.log("The Dao Contract Deployed to: %s:", address(washikaDao));
        vm.stopBroadcast();
    }
}
