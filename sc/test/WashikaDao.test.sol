//SPDX-License-Identifier: WDOL-License
pragma solidity ^0.8.3;

import "forge-std/Test.sol";
import "../src/WashikaDao.sol";

/**
 * Optimistic tests, only covering that the sc does what its supposed to do when given the right inputs
 */
contract WashikaDaoTest is Test {
    WashikaDao public washikaDao;
    address public creator = address(1);
    address public member1 = address(2);
    address public member2 = address(3);
    address public normalUser = address(4);
    address public user = address(5);
    address public addrToUseAsMsig = address(6);
    address public addrToUseAsMsig2 = address(7);

    function setUp() public {
        vm.startPrank(creator);
        washikaDao = new WashikaDao();
        vm.stopPrank();
    }

    function testCreateDao_HappyPath() public {
        string memory daoLocation = "Online";
        string memory daoObjective = "Build cool stuff";
        string memory daoTargetAudience = "Developers";
        string memory daoName = "AwesomeDAO";

        vm.prank(creator);
        // vm.recordLogs();
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        // Vm.Log[] memory entries = vm.getRecordedLogs();

        // Lets try to capture logs for emitted DAO ID
        //bytes32 daoId = entries[0].topics[1];
        // Option 2: get the latest DAO ID directly
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        (
            string memory storedName,
            string memory storedLocation,
            string memory storedObjective,
            string memory storedTargetAudience,
            address storedCreator,
            bytes32 storedId
        ) = washikaDao.platformDaoList(0);

        assertEq(storedName, daoName, "DAO name should match");
        assertEq(storedLocation, daoLocation, "DAO location should match");
        assertEq(storedObjective, daoObjective, "DAO objective should match");
        assertEq(storedTargetAudience, daoTargetAudience, "DAO target audience should match");
        assertEq(storedCreator, creator, "DAO creator should be the caller");
        assertEq(storedId, daoId, "DAO ID should match the stored ID");
        assertEq(washikaDao.getLatestDaoIdByCreatorX(creator), daoId, "Creator to DAO ID mapping should be correct");
        assertTrue(washikaDao.isDaoCreator(creator, daoId), "creator should own Dao bro");
        emit DAOCREATED(daoId, creator, daoName); // Check for the event
    }

    function testMultipleDaos() public {
        bytes32[] memory createdIds = new bytes32[](3);

        for (uint256 i = 0; i < 3; i++) {
            vm.prank(creator);
            washikaDao.createDao("Location", "Obj", "Audience", string(abi.encodePacked("DAO-", i)));
            createdIds[i] = washikaDao.getLatestDaoIdByCreatorX(creator);
        }

        // Verify all IDs
        assertTrue(createdIds[0] != createdIds[1], "IDs should be unique");
        assertTrue(createdIds[1] != createdIds[2], "IDs should be unique");
    }

    function test_multiple_daos_same_creator() public {
        // Create first DAO
        string memory daoLocation = "Online";
        string memory daoObjective = "Build cool stuff";
        string memory daoTargetAudience = "Developers";
        string memory daoName = "AwesomeDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId1 = washikaDao.getLatestDaoIdByCreatorX(creator);

        string memory daoLocation2 = "Online dao";
        string memory daoObjective2 = "Build cool stuffs";
        string memory daoTargetAudience2 = "Developers2";
        string memory daoName2 = "AwesomeDAOz";
        // Create second DAO
        vm.prank(creator);
        washikaDao.createDao(daoLocation2, daoObjective2, daoTargetAudience2, daoName2);
        bytes32 daoId2 = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Verify both DAOs recognize creator
        assertTrue(washikaDao.isDaoCreator(creator, daoId1), "Should recognize first DAO");
        assertTrue(washikaDao.isDaoCreator(creator, daoId2), "Should recognize second DAO");

        // Verify array contains both IDs
        bytes32[] memory createdIds = washikaDao.getDaoIdsByCreatorAddress(creator);
        assertEq(createdIds.length, 2, "Should have 2 DAO IDs");
        assertEq(createdIds[0], daoId1, "First ID should match");
        assertEq(createdIds[1], daoId2, "Second ID should match");
    }

    function test_creator_mapping_accuracy() public {
        // 1. Create the Dao first
        string memory daoLocation = "Online";
        string memory daoObjective = "Build cool stuff";
        string memory daoTargetAudience = "Developers";
        string memory daoName = "AwesomeDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        // 2. Get the latest DAO ID
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 3. Verify the mappings
        bytes32[] memory ids = washikaDao.getDaoIdsByCreatorAddress(creator);
        assertEq(ids[0], daoId, "Array mapping should match");
    }

    function testIsCreator_True() public {
        string memory daoLocation = "IRL";
        string memory daoObjective = "Make the world better";
        string memory daoTargetAudience = "Everyone";
        string memory daoName = "GlobalImpactDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        assertTrue(washikaDao.isDaoCreator(creator, daoId), "Should return true for the creator");
    }

    function testIsCreator_False() public {
        string memory daoLocation = "Decentralized";
        string memory daoObjective = "Innovate constantly";
        string memory daoTargetAudience = "Tech Enthusiasts";
        string memory daoName = "FutureForwardDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        assertFalse(washikaDao.isDaoCreator(user, daoId), "Should return false for a non-creator");
    }

    function testCreatorToDaoIdMapping() public {
        string memory daoLocation = "Virtual";
        string memory daoObjective = "Learn and grow";
        string memory daoTargetAudience = "Students";
        string memory daoName = "KnowledgeDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 expectedDaoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        assertEq(washikaDao.getLatestDaoIdByCreatorX(creator), expectedDaoId, "Creator to DAO ID mapping is incorrect");
    }

    function testCreateDao_PublicAccessibility() public {
        string memory daoLocation = "Hybrid";
        string memory daoObjective = "Connect and collaborate";
        string memory daoTargetAudience = "Professionals";
        string memory daoName = "NetworkPlusDAO";

        vm.prank(user); // A different user calls the function
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);

        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(user);
        assertNotEq(daoId, bytes32(0), "DAO should have been created by the user");
    }

    event DAOCREATED(bytes32 daoId, address indexed creator, string daoName);

    function test_GetDaosInPlatformArr_MultipleEntries() public {
        // 1. Create the Daos to use to test 2 for now
        string memory daoLocation1 = "Global";
        string memory daoObjective1 = "Connect people";
        string memory daoTargetAudience1 = "Humans";
        string memory daoName1 = "UnityDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation1, daoObjective1, daoTargetAudience1, daoName1);
        bytes32 daoId_1 = washikaDao.getLatestDaoIdByCreatorX(creator);

        string memory daoLocation2 = "Global Dao";
        string memory daoObjective2 = "Connect people globally";
        string memory daoTargetAudience2 = "Humans globally";
        string memory daoName2 = "UnityDAOGlobally";

        vm.prank(creator);
        washikaDao.createDao(daoLocation2, daoObjective2, daoTargetAudience2, daoName2);
        bytes32 daoId_2 = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Call the function we want to test
        WashikaDao.DaoDetails[] memory daos = washikaDao.getDaosInPlatformArr();

        // 3. Assertions
        assertEq(daos.length, 2, "Should return an array with two DAOs");
        assertEq(daos[0].daoName, "UnityDAO", "First DAO name should match");
        assertEq(daos[1].daoName, "UnityDAOGlobally", "Second DAO name should match");
    }

    function test_GetDaosInPlatformArr_EmptyArray() public {
        // 1. Creating the Daos
        // First, create a DAO
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Call the function we want to test
        WashikaDao.DaoDetails[] memory daos = washikaDao.getDaosInPlatformArr();

        // 3. Assertions
        assertEq(daos.length, 1, "Should return an array with one DAO");
        assertEq(daos[0].daoName, "UnityDAO", "DAO location should match");
        assertEq(daos[0].daoObjective, "Connect people", "DAO objective should match");
        assertEq(daos[0].daoTargetAudience, "Humans", "DAO target audience should match");
        assertEq(daos[0].daoCreator, creator, "DAO creator should match");
        assertEq(daos[0].daoId, daoId, "DAO ID should match");
    }

    function test_GetDaoAddressByDaoId_HappyPath() public {
        // 1. Creating the Dao
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2(a). Set the Dao Address
        vm.prank(creator);
        washikaDao.setDaoAddress(user, daoId);

        // 2(b). Call the function we want to test
        address daoAddress = washikaDao.getDaoAddressByDaoId(daoId);

        // 3. Assertions
        assertEq(daoAddress, user, "DAO address should match");
    }

    function test_GetDaoAddressByDaoId_MultipleTimes() public {
        // 1. Creating the Dao
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2(a). Set the Dao Address
        vm.prank(creator);
        washikaDao.setDaoAddress(user, daoId);

        // 2(b). Call the function we want to test
        address daoAddress1 = washikaDao.getDaoAddressByDaoId(daoId);
        address daoAddress2 = washikaDao.getDaoAddressByDaoId(daoId);

        // 3. Assertions
        assertEq(daoAddress1, user, "DAO address should be the same as the second one");
        assertEq(daoAddress2, user, "DAO address should be the same as the first one");
    }

    function test_SetDaoMultiSigById_HappyPath() public {
        // First, create a DAO
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 3(a). First lets see if it fails if already set
        bool isAlreadySet = washikaDao.isMultiSigAlreadySet(addrToUseAsMsig, daoId);
        assertEq(isAlreadySet, false, "MultiSig should not be set already since we've just set it");

        // 3(b). Calling the function to set the multiSig
        vm.prank(creator);
        washikaDao.setDaoMultiSigById(addrToUseAsMsig, daoId);

        // 3(c). Should set correctly
        address daoMultiSig = washikaDao.getDaoMultisigByDaoId(daoId);
        assertEq(daoMultiSig, addrToUseAsMsig, "DAO multiSig should match");

        // 3(d). Set again then check if it says that it has already been set
        vm.prank(creator);
        vm.expectRevert("MSIGAlreadySet");
        washikaDao.setDaoMultiSigById(addrToUseAsMsig, daoId);

        // 3(e). Check if fails(assertions)
        bool isAlreadySet2 = washikaDao.isMultiSigAlreadySet(addrToUseAsMsig, daoId);
        assertEq(isAlreadySet2, true, "MultiSig should be already set and this shouldn't work");

        // 4. Check only those with sufficient rights can do this
        vm.prank(user);
        vm.expectRevert("OnlyCreator");
        washikaDao.setDaoMultiSigById(addrToUseAsMsig, daoId);
    }

    function testAddMember_HappyPath() public {
        // First, create a DAO
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Now, add a member
        string memory memberEmail = "test@example.com";
        address newMemberAddress = member1;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail, newMemberAddress, daoId);

        assertTrue(washikaDao.isYMemberOfDaoX(daoId, newMemberAddress));
    }

    function testAddMember_OnlyCreator() public {
        // First, create a DAO
        string memory daoLocation = "Local";
        string memory daoObjective = "Improve community";
        string memory daoTargetAudience = "Residents";
        string memory daoName = "LocalDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Try to add a member with a non-creator address
        string memory memberEmail = "another@example.com";
        address nonCreatorAddress = normalUser;
        vm.prank(nonCreatorAddress);
        vm.expectRevert("OnlyCreator");
        washikaDao.addMemberToDao(memberEmail, nonCreatorAddress, daoId);
    }

    function testAddMember_ValidInputs() public {
        // First, create a DAO
        string memory daoLocation = "Worldwide";
        string memory daoObjective = "Share knowledge";
        string memory daoTargetAudience = "Learners";
        string memory daoName = "LearnDAO";
        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Add a member with valid inputs
        string memory memberEmail = "valid@email.com";
        address validMemberAddress = member2;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail, validMemberAddress, daoId);

        // Check if the member was added (basic check)
        assertTrue(washikaDao.isYMemberOfDaoX(daoId, validMemberAddress));
    }

    event MEMBERADDED(bytes32 indexed daoId, address indexed userAddress);

    function test_GetDaoMembers_HappyPath() public {
        // 1. Create a DAO and add members
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Add a member with valid inputs
        string memory memberEmail1 = "valid@email.com";
        address validMemberAddress1 = member1;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail1, validMemberAddress1, daoId);

        // Add another member with valid inputs
        string memory memberEmail2 = "valid@email.com";
        address validMemberAddress2 = member2;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail2, validMemberAddress2, daoId);

        // 2. Call the function we want to test
        // But first let us store it somewhere
        WashikaDao.MemberDetails[] memory members = washikaDao.getDaoMembers(daoId);

        // 3. Assertions
        assertEq(members.length, 2, "Should return the correct number of members");
        assertEq(members[0].memberAddress, member1, "First member should match");
        assertEq(members[1].memberAddress, member2, "Second member should match");
    }

    function test_GetDaoMembers_EmptyArray() public {
        // 1. Create a DAO without adding members
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Call the function
        WashikaDao.MemberDetails[] memory members = washikaDao.getDaoMembers(daoId);

        // 3. Assertions
        assertEq(members.length, 0, "Should return an empty array");
    }

    function test_GetMemberDetails_HappyPath() public {
        // 1. Create a DAO and add a member
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Add a member with valid inputs
        string memory memberEmail1 = "valid@email.com";
        address validMemberAddress1 = member1;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail1, validMemberAddress1, daoId);

        // Add another member with valid inputs
        string memory memberEmail2 = "valid@email.com";
        address validMemberAddress2 = member2;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail2, validMemberAddress2, daoId);

        // 2. Call the function we want to test
        WashikaDao.MemberDetails[] memory memberDetails = washikaDao.getMemberDetails(memberEmail1);

        // 3. Assertions
        assertEq(memberDetails.length, 2, "Should return two members");
        assertEq(memberDetails[0].memberAddress, validMemberAddress1, "Member address should match");
        assertEq(memberDetails[0].memberEmail, memberEmail1, "Member email should match");

        assertEq(memberDetails[1].memberAddress, validMemberAddress2, "Member address should match");
        assertEq(memberDetails[1].memberEmail, memberEmail2, "Member email should match");
    }

    function test_isYMemberOfDaoX_HappyPath() public {
        // 1. Create a DAO and add a member
        string memory daoLocation = "Global";
        string memory daoObjective = "Connect people";
        string memory daoTargetAudience = "Humans";
        string memory daoName = "UnityDAO";

        vm.prank(creator);
        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // Add a member with valid inputs
        string memory memberEmail1 = "valid@email.com";
        address validMemberAddress1 = member1;
        vm.prank(creator);
        washikaDao.addMemberToDao(memberEmail1, validMemberAddress1, daoId);

        // 2. Assertion for existence
        bool isMember = washikaDao.isYMemberOfDaoX(daoId, validMemberAddress1);
        assertTrue(isMember, "Member should be part of the DAO");

        // 3. Assertion for non-member
        bool isMember2 = washikaDao.isYMemberOfDaoX(daoId, normalUser);
        assertTrue(isMember, "Non-member should not be part of the DAO");

        // 4. Assertion for multiple calls
        bool isMember3 = washikaDao.isYMemberOfDaoX(daoId, validMemberAddress1);
        assertTrue(isMember3, "Member should be part of the DAO");
    }

    function testCreateProposal_HappyPath() public {
        // 1. Create a DAO and add a member
        string memory daoName = "ProposalDAO";
        vm.prank(creator);
        washikaDao.createDao("Online", "Discuss proposals", "Members", daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);
        vm.prank(creator);
        washikaDao.addMemberToDao("member@example.com", member1, daoId);

        // 2. Define proposal parameters
        string memory proposalUrl = "ipfs://proposal1.hash";
        string memory proposalTitle = "Implement Feature A";

        // 3. Creator (who is a member) creates the proposal
        vm.prank(creator);
        washikaDao.createProposal(proposalUrl, proposalTitle, daoId);

        // 4. Assertions

        // Check for PROPOSALCREATED event
        bytes32 proposalId = washikaDao.getProposalIdByTitle(proposalTitle);

        WashikaDao.ProposalDetails memory proposal =
            washikaDao.getProposalXById(washikaDao.getProposalIdByTitle(proposalTitle));
        // Check platformProposalList
        assertEq(
            washikaDao.getProposalOwnerByTitle(proposalTitle),
            creator,
            "Proposal Owner should be the creator of the proposal"
        );
        assertEq(washikaDao.getProposalIdByTitle(proposalTitle), proposalId, "Proposal ID Should match");
        assertEq(proposal.proposalUrl, proposalUrl, "ProposalUrlMustMatch");
        assertEq(proposal.proposalTitle, proposalTitle, "Proposal title should match");
        assertEq(proposal.proposalStatus, "ACTIVE", "Proposal status should be ACTIVE");
        assertEq(proposal.daoId, daoId, "Proposal daoId should match");
    }

    function testCreateProposal_GeneratesUniqueId() public {
        // 1. Create a DAO and add the creator as a member
        vm.prank(creator);
        washikaDao.createDao("Remote", "Vote on changes", "Token Holders", "VoteDAO");
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);

        // 2. Create two proposals
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "Another Proposal", daoId);
        bytes32 proposalId1 = washikaDao.getProposalIdByTitle("Another Proposal");

        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal3.hash", "Yet Another Proposal", daoId);
        bytes32 proposalId2 = washikaDao.getProposalIdByTitle("Yet Another Proposal");

        // 3. Assert that the proposal IDs are different
        assertNotEq(proposalId1, proposalId2, "Proposal IDs should be unique");
        //might be a problem comparing bytes like this but lets see.
    }

    function test_GetProposals_HappyPath() public {
        // 1. Create a DAO and add a member
        string memory daoName = "ProposalDAO";
        vm.prank(creator);
        washikaDao.createDao("Online", "Discuss proposals", "Members", daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);
      
        // 2(a). Assertions for dao with no proposal 
        WashikaDao.ProposalDetails[] memory proposalsm = washikaDao.getProposals(daoId);
        assertEq(proposalsm.length, 0, "Should return an empty array");


        // 2(b). Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "Another Proposal", daoId);
        bytes32 proposalId1 = washikaDao.getProposalIdByTitle("Another Proposal");

       // 3. Call the function we want to test 
        WashikaDao.ProposalDetails[] memory proposals = washikaDao.getProposals(daoId);

        // 4. Assertions
        assertEq(proposals.length, 1, "Should return an array with one proposal");
        assertEq(proposals[0].proposalTitle, "Another Proposal", "Proposal title should match");
        assertEq(proposals[0].proposalUrl, "ipfs://proposal2.hash", "Proposal URL should match");
        assertEq(proposals[0].proposalStatus, "ACTIVE", "Proposal status should be ACTIVE");
        assertEq(proposals[0].daoId, daoId, "DAO ID should match");

        // 4(c). Assertions for dao with multiple proposals 
        // Create another proposal 
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash22", "Another Proposal22", daoId);
        bytes32 proposalId2 = washikaDao.getProposalIdByTitle("Another Proposal22");

        // Call the function we want to test
        WashikaDao.ProposalDetails[] memory proposals3 = washikaDao.getProposals(daoId); 

        //  Assertions
        assertEq(proposals3.length, 2, "Should return an array with two proposals"); 

    }

    function test_GetProposalXById_HappyPath() public {
        // 1. Create a DAO and add a member
        string memory daoName = "ProposalDAO";
        vm.prank(creator);
        washikaDao.createDao("Online", "Discuss proposals", "Members", daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);


        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);

        // Assertion (1). Should revert when we give it an invalid proposal id 
        bytes32 bogousProposalId = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        vm.expectRevert("Proposalnotfound");
        WashikaDao.ProposalDetails memory proposals_1 = washikaDao.getProposalXById(bogousProposalId); 

        // 2. Create a proposal 
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "Another Proposal", daoId);

        // 3. Assertion (2). Returns the correct details when probed 
        bytes32 proposalId_r = washikaDao.getProposalIdByTitle("Another Proposal");
        WashikaDao.ProposalDetails memory proposal_r = washikaDao.getProposalXById(proposalId_r);
        assertEq(proposal_r.proposalTitle, "Another Proposal", "Proposal title should match");
        assertEq(proposal_r.proposalUrl, "ipfs://proposal2.hash", "Proposal URL should match");
        assertEq(proposal_r.proposalStatus, "ACTIVE", "Proposal status should be ACTIVE");
        assertEq(proposal_r.daoId, daoId, "DAO ID should match");
        assertEq(proposal_r.proposalOwner, creator, "Proposal owner should match");
        assertEq(proposal_r.proposalId, proposalId_r, "Proposal ID should match"); 

        // 4. Assertion (3). Revert when ID not found 
        bytes32 invalidProposalId_2 = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        vm.expectRevert("Proposalnotfound");
        washikaDao.getProposalXById(invalidProposalId_2);
    }

    function test_doesProposalTitleXExistinDaoIdY() public {
        // 1. Create a DAO and add a member
        string memory daoName = "ProposalDAO";
        vm.prank(creator);
        washikaDao.createDao("Online", "Discuss proposals", "Members", daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);


        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);

        // 2. Create a proposal 
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "AnotherProposal", daoId);
         // 3. Assertion (1). Should return true for proposal that does exist in that DAO
       // bool doesExist2 = washikaDao.doesProposalTitleXExistinDaoIdY("AnotherProposal", daoId);
        //assertTrue(doesExist2, "Proposal should exist in the DAO");
    
        // 4. Assertion (2). Should return false for proposal that does not exist in that DAO 
        bool doesExist = washikaDao.doesProposalTitleXExistinDaoIdY("NonExistentProposal", daoId);
        assertFalse(doesExist, "Proposal should not exist in the DAO");
       
        // 5. Assertion (3). Should revert when we give it an invalid dao id
        bytes32 bogousDaoId = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        vm.expectRevert("InvalidDaoId");
        washikaDao.doesProposalTitleXExistinDaoIdY("Another Proposal", bogousDaoId);
       
    }


    // HAPPY PATH TESTS FOR UPVOTE
    function testUpVote_HappyPath() public {
        // 1. Create a DAO
        vm.prank(creator);
        string memory daoLocation = "IRL";
        string memory daoObjective = "Make the world better";
        string memory daoTargetAudience = "Everyone";
        string memory daoName = "GlobalImpactDAO";

        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Add the creator as a member
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);

        // Lets try adding another member to see
        vm.prank(creator);
        washikaDao.addMemberToDao("memberyes1@example.com", member1, daoId);

        // 2. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "Another Proposal", daoId);

        // 3. Get the proposal ID
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Another Proposal");

        // 4. Member upvotes the proposal
        vm.prank(member1);
        washikaDao.upVote(proposalId, daoId);

        // Lets try sth novel, okay? How about we get the specific vote and then cross check it
        bytes32 voteId = washikaDao.getVoteIdByUserAddress(member1, proposalId);
        WashikaDao.VoteDetails memory upVoteDetails = washikaDao.getVoteXById(voteId);

        // 5. Assertions
        // Check if vote details are stored in voteDetails array
        assertTrue(washikaDao.getUpVotes(proposalId) > 0, "Vote details should be stored in voteDetails");
        // WashikaDao.VoteDetails memory vote = washikaDao.voteDetails[washikaDao.voteDetails.length - 1];
        assertEq(upVoteDetails.voterAddress, member1, "VoterAddress Should Match");
        assertEq(upVoteDetails.proposalId, proposalId, "Proposal ID should match");
        assertEq(upVoteDetails.voteType, true, "Obviously this is an upvote bruh should def match fr fr");
        assertEq(upVoteDetails.daoId, daoId, "Dao ID should match");
    }



    function testUpVote_NonMember() public {
        // 1. Create a DAO
        vm.prank(creator);
        washikaDao.createDao("TestDao", "Test Objective", "Test Audience", "TestDAO");
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Get the proposal ID
        // 2. Add the creator as a member, weirdly
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@gmail.com", creator, daoId);

        // 3. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://test.hash", "Test Proposal", daoId);
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Test Proposal");

        // bytes32 proposalId = washikaDao.getDaoIdToPropoosalId(daoId);

        // 3. Non-member tries to upvote
        vm.prank(normalUser);
        vm.expectRevert("OnlyMember");
        washikaDao.upVote(proposalId, daoId);
    }

    function testUpVote_MultipleUpvotesFromSameMember() public {
        // 1. Create a DAO
        vm.prank(creator);
        washikaDao.createDao("TestDao", "Test Objective", "Test Audience", "TestDAO");
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Add the creator as a member, weirdly
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@gmail.com", creator, daoId);

        // 3. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://test.hash", "Test Proposal", daoId);
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Test Proposal");

        // 4. Add a Member who will try to upvote multiple times
        vm.prank(creator);
        washikaDao.addMemberToDao("member1@example.com", member1, daoId);

        // 5. Member tries to upvote multiple times
        vm.prank(member1);
        washikaDao.upVote(proposalId, daoId);
        vm.prank(member1);
        vm.expectRevert("VoterFraudAttemptDontTryAgain");
        washikaDao.upVote(proposalId, daoId);

        // 6. Assertions = Check that multiple votes are recorded
        uint256 upVoteCount = washikaDao.getUpVotes(proposalId);
        assertEq(upVoteCount, 1, "Should only record one upvote from the same member");
    }
    // HAPPY PATH TESTS FOR DOWNVOTE

    function testDownVote_HappyPath() public {
        // 1. Create a DAO
        vm.prank(creator);
        string memory daoLocation = "IRL";
        string memory daoObjective = "Make the world better";
        string memory daoTargetAudience = "Everyone";
        string memory daoName = "GlobalImpactDAO";

        washikaDao.createDao(daoLocation, daoObjective, daoTargetAudience, daoName);
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Add the creator as a member
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@example.com", creator, daoId);

        // Lets try adding another member to see
        vm.prank(creator);
        washikaDao.addMemberToDao("memberyes1@example.com", member1, daoId);

        // 2. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://proposal2.hash", "Another Proposal", daoId);

        // 3. Get the proposal ID
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Another Proposal");

        // 4. Member upvotes the proposal
        vm.prank(member1);
        washikaDao.downVote(proposalId, daoId);

        // Lets try sth novel, okay? How about we get the specific vote and then cross check it
        bytes32 voteId = washikaDao.getVoteIdByUserAddress(member1, proposalId);
        WashikaDao.VoteDetails memory downVoteDetails = washikaDao.getVoteXById(voteId);

        // 5. Assertions
        // Check if vote details are stored in voteDetails array
        assertTrue(washikaDao.getDownVotes(proposalId) > 0, "Vote details should be stored in voteDetails");
        // WashikaDao.VoteDetails memory vote = washikaDao.voteDetails[washikaDao.voteDetails.length - 1];
        assertEq(downVoteDetails.voterAddress, member1, "VoterAddress Should Match");
        assertEq(downVoteDetails.proposalId, proposalId, "Proposal ID should match");
        assertEq(downVoteDetails.voteType, false, "Obviously this is an downvote bruh should def match fr fr");
        assertEq(downVoteDetails.daoId, daoId, "Dao ID should match");
    }

    // EDGE CASE TESTS FOR DOWN

    function testDownVote_NonMember() public {
        // 1. Create a DAO
        vm.prank(creator);
        washikaDao.createDao("TestDao", "Test Objective", "Test Audience", "TestDAO");
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Get the proposal ID
        // 2. Add the creator as a member, weirdly
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@gmail.com", creator, daoId);

        // 3. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://test.hash", "Test Proposal", daoId);
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Test Proposal");

        // bytes32 proposalId = washikaDao.getDaoIdToPropoosalId(daoId);

        // 3. Non-member tries to upvote
        vm.prank(normalUser);
        vm.expectRevert("OnlyMember");
        washikaDao.downVote(proposalId, daoId);
    }

    function testDownVote_MultipleUpvotesFromSameMember() public {
        // 1. Create a DAO
        vm.prank(creator);
        washikaDao.createDao("TestDao", "Test Objective", "Test Audience", "TestDAO");
        bytes32 daoId = washikaDao.getLatestDaoIdByCreatorX(creator);

        // 2. Add the creator as a member, weirdly
        vm.prank(creator);
        washikaDao.addMemberToDao("creator@gmail.com", creator, daoId);

        // 3. Create a proposal
        vm.prank(creator);
        washikaDao.createProposal("ipfs://test.hash", "Test Proposal", daoId);
        bytes32 proposalId = washikaDao.getProposalIdByTitle("Test Proposal");

        // 4. Add a Member who will try to upvote multiple times
        vm.prank(creator);
        washikaDao.addMemberToDao("member1@example.com", member1, daoId);

        // 5. Member tries to upvote multiple times
        vm.prank(member1);
        washikaDao.downVote(proposalId, daoId);
        vm.prank(member1);
        vm.expectRevert("VoterFraudAttemptDontTryAgain");
        washikaDao.downVote(proposalId, daoId);

        // 6. Assertions = Check that multiple votes are recorded
        uint256 downVoteCount = washikaDao.getDownVotes(proposalId);
        assertEq(downVoteCount, 1, "Should only record one upvote from the same member");
    }
}
