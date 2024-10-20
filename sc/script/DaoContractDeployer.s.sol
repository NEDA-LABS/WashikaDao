// pragma solidity ^0.8.0;

// import {Script, console} from "forge-std/Script.sol";
// //import "../src/DaoContract.sol";
// import "../src/FullDaoContract.sol";

// contract CounterScript is Script {
//     function setUp() public {}

//     function run() public {
//         uint256 privateKey = vm.envUint("PRIVATE_KEY");
//         address owner = vm.addr(privateKey);
//         console.log(owner);
//         vm.startBroadcast(privateKey);
//         FullDaoContract fullDaoContract = new FullDaoContract(); //No Contract constructor args needed
//         console.log(
//             "The Dao Contract Deployed to: %s:",
//             address(fullDaoContract)
//         );
//         vm.stopBroadcast();
//     }
// }

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {FullDaoContract} from "../src/FullDaoContract.sol";

contract CounterScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey;
        uint256 chainId;
        // if (chainId == 31337) {}
        if (chainId == 84532) {
            privateKey = vm.envUint("PRIVATE_KEY"); // Retrieve the private key from environment
        }
        privateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        //string memory etherscanApiKey = vm.envString("ETHERSCAN_API_KEY"); // Retrieve the API key for contract verification
        address owner = vm.addr(privateKey);
        console.log("Owner Address:", owner);

        // Start broadcasting
        vm.startBroadcast(privateKey);

        // Deploy the DAO contract
        FullDaoContract fullDaoContract = new FullDaoContract();
        console.log("The DAO Contract Deployed to:", address(fullDaoContract));

        // Verify the contract on Blockscout / Base Sepolia scan (assumes support for API verification)
        // verifyContract(address(fullDaoContract), etherscanApiKey);

        // Call createDao function (assuming it exists in FullDaoContract)
        fullDaoContract.createDao(
            "Wadao",
            "Dar es salaam",
            "Mburahati",
            "WADAO",
            "Lending and savings DAO",
            "Located in Dar es salaam financially including low class",
            "",
            owner,
            756202220
        );
        console.log("DAO Created by:", owner);

        // Add a member to the DAO (assuming the function addMember exists)
        address newMember = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Replace with a valid address
        fullDaoContract.addMember(
            "Rasta",
            "buyegiminzi@gmail.com",
            756202220,
            726653,
            FullDaoContract.Role.member,
            newMember,
            owner,
            756202220
        );
        console.log("New member added:", newMember);

        // // Add a proposal (assuming addProposal exists and takes a string description)
        // string memory proposalDescription = "Proposal to improve governance";
        // fullDaoContract.addProposal(proposalDescription);
        // console.log("Proposal added:", proposalDescription);

        // // Cast a vote (assuming vote exists and takes a proposal ID and a vote type)
        // uint256 proposalId = 1; // Replace with actual proposal ID after creation
        // fullDaoContract.vote(proposalId, true); // True for yes vote, false for no
        // console.log("Voted on Proposal ID:", proposalId);

        // Stop broadcasting
        vm.stopBroadcast();
    }

    // Function to verify the contract on Blockscout/Base Sepolia scan
    function verifyContract(
        address contractAddress,
        string memory apiKey
    ) internal {
        console.log("Verifying contract at address:", contractAddress);

        // Using Foundry's create2 to verify on etherscan/blockscout
        vm.broadcast(); // You can use Foundry's etherscan API support here
        console.log("Verification started for contract at:", contractAddress);

        // Run the forge verification command (could be done manually if needed)
        // Example: forge verify-contract --chain-id <CHAIN_ID> <CONTRACT_ADDRESS> <CONTRACT_NAME> --etherscan-api-key <API_KEY>
    }
}
