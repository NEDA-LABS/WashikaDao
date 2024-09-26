// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import "forge-std/Test.sol";
import "../src/FullDaoContract.sol";
    // Creating a DAO with valid inputs should add it to the daoList and emit DAOCreated event
    contract TestFullDaoContract is Test{
function test_create_dao_with_valid_inputs() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory daoName = "Test DAO";
    string memory location = "Test Location";
    string memory targetAudience = "Test Audience";
    string memory daoTitle = "Test Title";
    string memory daoDescription = "Test Description";
    string memory daoOverview = "Test Overview";
    string memory daoImageUrlHash = "TestHash";
    address multiSigAddr = address(0x123);
    uint256 multiSigPhoneNo = 1234567890;

    // Act
    daoContract.createDao(
        daoName,
        location,
        targetAudience,
        daoTitle,
        daoDescription,
        daoOverview,
        daoImageUrlHash,
        multiSigAddr,
        multiSigPhoneNo
    );

    // Assert
    FullDaoContract.DaoDetails memory createdDao = daoContract.getDaoByMultiSig(multiSigAddr);
    assertEq(createdDao.daoName, daoName);
    assertEq(createdDao.location, location);
    assertEq(createdDao.targetAudience, targetAudience);
    assertEq(createdDao.daoTitle, daoTitle);
    assertEq(createdDao.daoDescription, daoDescription);
    assertEq(createdDao.daoOverview, daoOverview);
    assertEq(createdDao.daoImageUrlHash, daoImageUrlHash);
    assertEq(createdDao.multiSigAddr, multiSigAddr);
    assertEq(createdDao.multiSigPhoneNo, multiSigPhoneNo);

    // Check event emission
    (address emittedAddr, string memory emittedName, string memory emittedDescription) = abi.decode(
        vm.getRecordedLogs()[0].data,
        (address, string, string)
    );
    assertEq(emittedAddr, multiSigAddr);
    assertEq(emittedName, daoName);
    assertEq(emittedDescription, daoDescription);
}
    // Retrieving DAO details by a valid multi-signature address should return the correct DaoDetails
function test_retrieve_dao_details_by_multi_sig() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory daoName = "Test DAO";
    string memory location = "Test Location";
    string memory targetAudience = "Test Audience";
    string memory daoTitle = "Test Title";
    string memory daoDescription = "Test Description";
    string memory daoOverview = "Test Overview";
    string memory daoImageUrlHash = "TestHash";
    address multiSigAddr = address(0x123);
    uint256 multiSigPhoneNo = 1234567890;
    daoContract.createDao(daoName, location, targetAudience, daoTitle, daoDescription, daoOverview, daoImageUrlHash, multiSigAddr, multiSigPhoneNo);

    // Act
    FullDaoContract.DaoDetails memory retrievedDao = daoContract.getDaoByMultiSig(multiSigAddr);

    // Assert
    assertEq(retrievedDao.daoName, daoName);
    assertEq(retrievedDao.location, location);
    assertEq(retrievedDao.targetAudience, targetAudience);
    assertEq(retrievedDao.daoTitle, daoTitle);
    assertEq(retrievedDao.daoDescription, daoDescription);
    assertEq(retrievedDao.daoOverview, daoOverview);
    assertEq(retrievedDao.daoImageUrlHash, daoImageUrlHash);
    assertEq(retrievedDao.multiSigAddr, multiSigAddr);
    assertEq(retrievedDao.multiSigPhoneNo, multiSigPhoneNo);
}
    // Setting a phone number for a multi-signature address should update MsigToPhoneNumber mapping
function test_set_phone_number_for_multi_sig_address_updates_mapping() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    address multiSigAddr = address(0x789);
    uint256 phoneNumber = 9876543210;

    // Act
    daoContract.setMsigToPhoneNumber(multiSigAddr, phoneNumber);

    // Assert
    uint256 updatedPhoneNumber = daoContract.getMsigToPhoneNumber(multiSigAddr);
    assertEq(updatedPhoneNumber, phoneNumber);
}
    // Adding a member to a DAO with valid inputs should update daoMembers and emit MemberAdded event
function test_add_member_to_dao_with_valid_inputs() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory memberName = "John Doe";
    string memory emailAddress = "john.doe@example.com";
    uint256 phoneNumber = 1234567890;
    uint256 nationalId = 1234567890123;
    FullDaoContract.Role role = FullDaoContract.Role.member;
    address userAddress = address(0x456);
    address daoMultiSigAddr = address(0x789);
    uint256 multiSigPhoneNo = 9876543210;

    // Act
    daoContract.addMember(
        memberName,
        emailAddress,
        phoneNumber,
        nationalId,
        role,
        userAddress,
        daoMultiSigAddr,
        multiSigPhoneNo
    );

    // Assert
    FullDaoContract.MemberDetails[] memory members = daoContract.getMembers(daoMultiSigAddr);
    assertEq(members.length, 1);
    assertEq(members[0].memberName, memberName);
    assertEq(members[0].emailAddress, emailAddress);
    assertEq(members[0].phoneNumber, phoneNumber);
    assertEq(members[0].nationalId, nationalId);
   // assertEq(members[0].role, role);
    assertEq(members[0].userAddress, userAddress);
    assertEq(members[0].daoMultiSigAddr, daoMultiSigAddr);
    assertEq(members[0].multiSigPhoneNo, multiSigPhoneNo);

    // Check event emission
    (address emittedAddr, string memory emittedEmail, FullDaoContract.Role emittedRole) = abi.decode(
        vm.getRecordedLogs()[0].data,
        (address, string, FullDaoContract.Role)
    );
    assertEq(emittedAddr, userAddress);
    assertEq(emittedEmail, emailAddress);
    //assertEq(emittedRole, role);
}
    // Retrieving all members of a DAO should return the correct list of MemberDetails
function test_retrieve_all_members_of_dao() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory memberName = "John Doe";
    string memory emailAddress = "john.doe@example.com";
    uint256 phoneNumber = 1234567890;
    uint256 nationalId = 1234567890123;
    FullDaoContract.Role role = FullDaoContract.Role.member;
    address userAddress = address(0x456);
    address daoMultiSigAddr = address(0x789);
    uint256 multiSigPhoneNo = 9876543210;

    // Add a member to the DAO
    daoContract.addMember(
        memberName,
        emailAddress,
        phoneNumber,
        nationalId,
        role,
        userAddress,
        daoMultiSigAddr,
        multiSigPhoneNo
    );

    // Act
    FullDaoContract.MemberDetails[] memory members = daoContract.getMembers(daoMultiSigAddr);

    // Assert
    assertEq(members.length, 1);
    assertEq(members[0].memberName, memberName);
    assertEq(members[0].emailAddress, emailAddress);
    assertEq(members[0].phoneNumber, phoneNumber);
    assertEq(members[0].nationalId, nationalId);
    assertEq(members[0].role, role);
    assertEq(members[0].userAddress, userAddress);
    assertEq(members[0].daoMultiSigAddr, daoMultiSigAddr);
    assertEq(members[0].multiSigPhoneNo, multiSigPhoneNo);
}
    // Adding a proposal to a DAO with valid inputs should update daoProposals
function test_adding_proposal_to_dao_with_valid_inputs() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory pTitle = "Test Proposal";
    string memory pSummary = "Test Summary";
    string memory pDescription = "Test Description";
    uint256 duration = 3600; // 1 hour
    address daoMultiSigAddr = address(0x456);

    // Act
    daoContract.addProposal(daoMultiSigAddr, pTitle, pSummary, pDescription, duration);

    // Assert
    FullDaoContract.ProposalDetails[] memory proposals = daoContract.getProposals(daoMultiSigAddr);
    assertEq(proposals.length, 1);
    assertEq(proposals[0].pTitle, pTitle);
    assertEq(proposals[0].pSummary, pSummary);
    assertEq(proposals[0].pDescription, pDescription);

    // Check if proposal is expired
    bool isExpired = daoContract.isProposalExpired(daoMultiSigAddr, 0);
    assertEq(isExpired == false); // Proposal should not be expired immediately after creation
}
    // Casting a vote on a valid proposal should update proposalVotes
function test_cast_vote_on_valid_proposal_should_update_proposal_votes() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory pTitle = "Test Proposal";
    bool voteType = true;
    address daoMultiSigAddr = address(0x456);

    // Create a proposal
    daoContract.addProposal(daoMultiSigAddr, pTitle, "Summary", "Description", 3600);

    // Act
    daoContract.castVote(daoMultiSigAddr, pTitle, voteType);

    // Assert
    FullDaoContract.VoteDetails[] memory votes = daoContract.getVotes(daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes.length, 1);
    assertEq(votes[0].voterAddr, address(this));
    assertEq(votes[0].pOwner, daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[0].voteType, voteType);
}
    // Retrieving all votes for a specific proposal should return the correct list of VoteDetails
function test_retrieve_votes_for_specific_proposal() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    address daoMultiSigAddr = address(0x456);
    string memory pTitle = "Test Proposal";
    bool voteType = true;

    // Add a proposal
    daoContract.addProposal(daoMultiSigAddr, pTitle, "Summary", "Description", 3600);

    // Cast votes on the proposal
    daoContract.castVote(daoMultiSigAddr, pTitle, true);
    daoContract.castVote(daoMultiSigAddr, pTitle, false);

        // Ensure the function is accessible
     address proposalOwner = daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle);
    // Act
    FullDaoContract.VoteDetails[] memory votes = daoContract.getVotes(daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));

    // Assert
    assertEq(votes.length, 2);
    assertEq(votes[0].voterAddr, address(this));
    assertEq(votes[0].pOwner, daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[0].voteType, true);
    assertEq(votes[1].voterAddr, address(this));
    assertEq(votes[1].pOwner, daoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[1].voteType, false);
}
    // Retrieving all proposals for a specific DAO should return the correct list of ProposalDetails
function test_retrieve_all_proposals_for_dao() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    address daoMultiSigAddr = address(0x456);

    // Add proposals to the DAO
    daoContract.addProposal(daoMultiSigAddr, "Proposal 1", "Summary 1", "Description 1", 3600);
    daoContract.addProposal(daoMultiSigAddr, "Proposal 2", "Summary 2", "Description 2", 7200);

    // Act
    FullDaoContract.ProposalDetails[] memory proposals = daoContract.getProposals(daoMultiSigAddr);

    // Assert
    assertEq(proposals.length, 2);
    assertEq(proposals[0].pTitle, "Proposal 1");
    assertEq(proposals[1].pTitle, "Proposal 2");
    // Add more assertions based on the expected ProposalDetails
}
    // Retrieving a specific proposal by title should return the correct ProposalDetails
function test_retrieve_proposal_by_title() public {
    // Arrange
    FullDaoContract daoContract = new FullDaoContract();
    string memory pTitle = "Test Proposal";
    string memory pSummary = "Test Summary";
    string memory pDescription = "Test Description";
    uint256 duration = 3600;
    address daoMultiSigAddr = address(0x456);

    // Act
    daoContract.addProposal(daoMultiSigAddr, pTitle, pSummary, pDescription, duration);

    // Assert
    FullDaoContract.ProposalDetails memory retrievedProposal = daoContract.getProposalByTitle(daoMultiSigAddr, pTitle);
    assertEq(retrievedProposal.pTitle, pTitle);
    assertEq(retrievedProposal.pSummary, pSummary);
    assertEq(retrievedProposal.pDescription, pDescription);
    // Additional assertions can be added based on the specific fields of ProposalDetails
}
    }
