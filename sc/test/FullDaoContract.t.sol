// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "forge-std/Test.sol";
import "../src/FullDaoContract.sol";
    // Creating a DAO with valid inputs should add it to the daoList and emit DAOCreated event
contract TestFullDaoContract is Test{

    FullDaoContract fullDaoContract;

    function setUp() public {
        fullDaoContract = new FullDaoContract();//Initializing the contract we are going to be testing
    }

    function test_create_dao_with_valid_inputs() public {
        //fullDaoContract = new FullDaoContract();
        string memory _daoName = "Test DAO";
        string memory _location = "Test Location";
        string memory _targetAudience = "Test Audience";
        string memory _daoTitle = "Test Title";
        string memory _daoDescription = "Test Description";
        string memory _daoOverview = "Test Overview";
        string memory _daoImageUrlHash = "TestHash";
        address _multiSigAddr = address(0x123);
        uint256 _multiSigPhoneNo = 1234567890;

    // Act
        fullDaoContract.createDao(
        _daoName,
        _location,
        _targetAudience,
        _daoTitle,
        _daoDescription,
        _daoOverview,
        _daoImageUrlHash,
        _multiSigAddr,
        _multiSigPhoneNo
        //_daoIdentifier
    );
    //Initializing an instance of the struct holding dao details
        FullDaoContract.DaoDetails memory daoDetails = FullDaoContract.DaoDetails({
        daoName: _daoName,
        location: _location,
        targetAudience: _targetAudience,
        daoTitle: _daoTitle,
        daoDescription: _daoDescription,
        daoOverview: _daoOverview,
        daoImageUrlHash: _daoImageUrlHash,
        multiSigAddr: _multiSigAddr,
        multiSigPhoneNo: _multiSigPhoneNo
        //daoIdentifier: _daoIdentifier
    });
      // Assert
    fullDaoContract.getDaoByMultiSig(_multiSigAddr);
    assertEq(daoDetails.daoDescription, _daoDescription);
    assertEq(daoDetails.daoName, _daoName);
    assertEq(daoDetails.location, _location);
    assertEq(daoDetails.targetAudience, _targetAudience);
    assertEq(daoDetails.daoTitle, _daoTitle);
    assertEq(daoDetails.daoDescription, _daoDescription);
    assertEq(daoDetails.daoOverview, _daoOverview);
    assertEq(daoDetails.daoImageUrlHash, _daoImageUrlHash);
    assertEq(daoDetails.multiSigAddr, _multiSigAddr);
    assertEq(daoDetails.multiSigPhoneNo, _multiSigPhoneNo);

}
    // Retrieving DAO details by a valid multi-signature address should return the correct DaoDetails
function test_retrieve_dao_details_by_multi_sig() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
        string memory _daoName = "Test DAO";
        string memory _location = "Test Location";
        string memory _targetAudience = "Test Audience";
        string memory _daoTitle = "Test Title";
        string memory _daoDescription = "Test Description";
        string memory _daoOverview = "Test Overview";
        string memory _daoImageUrlHash = "TestHash";
        address _multiSigAddr = address(0x123);
        uint256 _multiSigPhoneNo = 1234567890;
       //bytes32 _daoIdentifier = 12455;

        vm.expectEmit();
        emit FullDaoContract.DAOCREATED(_multiSigAddr, _daoName, _daoDescription);


    fullDaoContract.createDao(_daoName, _location, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageUrlHash, _multiSigAddr, _multiSigPhoneNo);

    // Act
    //if error remove instance of contract & do a direct initialization.
    FullDaoContract.DaoDetails memory retrievedDao = fullDaoContract.getDaoByMultiSig(_multiSigAddr);
    // Assert
    assertEq(retrievedDao.daoName, _daoName);
    assertEq(retrievedDao.location, _location);
    assertEq(retrievedDao.targetAudience, _targetAudience);
    assertEq(retrievedDao.daoTitle, _daoTitle);
    assertEq(retrievedDao.daoDescription, _daoDescription);
    assertEq(retrievedDao.daoOverview, _daoOverview);
    assertEq(retrievedDao.daoImageUrlHash, _daoImageUrlHash);
    assertEq(retrievedDao.multiSigAddr, _multiSigAddr);
    assertEq(retrievedDao.multiSigPhoneNo, _multiSigPhoneNo);
}
    // Setting a phone number for a multi-signature address should update MsigToPhoneNumber mapping
function test_set_phone_number_for_multi_sig_address_updates_mapping() public {
    // Arrange
    //fullDaoContract = new FullDaoContract();
    address multiSigAddr = address(0x789);
    uint256 phoneNumber = 9876543210;

    // Act
    fullDaoContract.setMsigToPhoneNumber(multiSigAddr, phoneNumber);

    // Assert
    uint256 updatedPhoneNumber = fullDaoContract.getMsigToPhoneNumber(multiSigAddr);
    assertEq(updatedPhoneNumber, phoneNumber);
}
    // Adding a member to a DAO with valid inputs should update daoMembers and emit MemberAdded event
function test_add_member_to_dao_with_valid_inputs() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    string memory memberName = "John Doe";
    string memory emailAddress = "john.doe@example.com";
    uint256 phoneNumber = 1234567890;
    uint256 nationalId = 1234567890123;
    FullDaoContract.Role role = FullDaoContract.Role.member;
    address userAddress = address(0x456);
    address daoMultiSigAddr = address(0x789);
    uint256 multiSigPhoneNo = 9876543210;

 // Check event emission
    //vm.expectEmit();
    //emit MemberAdded(userAddress, emailAddress, role);
    // Act
    fullDaoContract.addMember(
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
    FullDaoContract.MemberDetails[] memory members = fullDaoContract.getMembers(daoMultiSigAddr);
    assertEq(members.length, 1);
    assertEq(members[0].memberName, memberName);
    assertEq(members[0].emailAddress, emailAddress);
    assertEq(members[0].phoneNumber, phoneNumber);
    assertEq(members[0].nationalId, nationalId);
    assertEq(members[0].userAddress, userAddress);
    assertEq(members[0].daoMultiSigAddr, daoMultiSigAddr);
    assertEq(members[0].multiSigPhoneNo, multiSigPhoneNo);


}
    // Retrieving all members of a DAO should return the correct list of MemberDetails
function test_retrieve_all_members_of_dao() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    string memory memberName = "John Doe";
    string memory emailAddress = "john.doe@example.com";
    uint256 phoneNumber = 1234567890;
    uint256 nationalId = 1234567890123;
    FullDaoContract.Role role = FullDaoContract.Role.member;
    //FullDaoContract.Role role = FullDaoContract.Role.member;
    address userAddress = address(0x456);
    address daoMultiSigAddr = address(0x789);
    uint256 multiSigPhoneNo = 9876543210;

    // Add a member to the DAO
    fullDaoContract.addMember(memberName,emailAddress,phoneNumber,nationalId,role,userAddress,daoMultiSigAddr,multiSigPhoneNo);
  // Act
    FullDaoContract.MemberDetails[] memory members = fullDaoContract.getMembers(daoMultiSigAddr);
    // Assert
    assertEq(members.length, 1);
    assertEq(members[0].memberName, memberName);
    assertEq(members[0].emailAddress, emailAddress);
    assertEq(members[0].phoneNumber, phoneNumber);
    assertEq(members[0].nationalId, nationalId);
    //assertEq(fullDaoContract.Role.members[0], fullDaoContract.Role.role);
    assertEq(members[0].userAddress, userAddress);
    assertEq(members[0].daoMultiSigAddr, daoMultiSigAddr);
    assertEq(members[0].multiSigPhoneNo, multiSigPhoneNo);
}
    // Adding a proposal to a DAO with valid inputs should update daoProposals
function test_adding_proposal_to_dao_with_valid_inputs() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    string memory pTitle = "Test Proposal";
    string memory pSummary = "Test Summary";
    string memory pDescription = "Test Description";
    uint256 duration = 3600; // 1 hour
    address daoMultiSigAddr = address(0x456);

    // Act
    fullDaoContract.addProposal(daoMultiSigAddr, pTitle, pSummary, pDescription, duration);

    // Assert
    FullDaoContract.ProposalDetails[] memory proposals = fullDaoContract.getProposals(daoMultiSigAddr);
    assertEq(proposals.length, 1);
    assertEq(proposals[0].pTitle, pTitle);
    assertEq(proposals[0].pSummary, pSummary);
    assertEq(proposals[0].pDescription, pDescription);

    // Check if proposal is expired
    bool isExpired = fullDaoContract.isProposalExpired(daoMultiSigAddr, 0);
    assertEq(isExpired, false); // Proposal should not be expired immediately after creation
}
    // Casting a vote on a valid proposal should update proposalVotes
function test_cast_vote_on_valid_proposal_should_update_proposal_votes() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    string memory pTitle = "Test Proposal";
    bool voteType = true;
    address daoMultiSigAddr = address(0x456);

    // Create a proposal
    fullDaoContract.addProposal(daoMultiSigAddr, pTitle, "Summary", "Description", 3600);

    // Act
    fullDaoContract.castVote(daoMultiSigAddr, pTitle, voteType);

    // Assert
    FullDaoContract.VoteDetails[] memory votes = fullDaoContract.getVotes(fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes.length, 1);
    assertEq(votes[0].voterAddr, address(this));
    assertEq(votes[0].pOwner, fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[0].voteType, voteType);
}
    // Retrieving all votes for a specific proposal should return the correct list of VoteDetails
function test_retrieve_votes_for_specific_proposal() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    address daoMultiSigAddr = address(0x456);
    string memory pTitle = "Test Proposal";
    bool voteType = true;

    // Add a proposal
    fullDaoContract.addProposal(daoMultiSigAddr, pTitle, "Summary", "Description", 3600);

    // Cast votes on the proposal
    fullDaoContract.castVote(daoMultiSigAddr, pTitle, true);
    fullDaoContract.castVote(daoMultiSigAddr, pTitle, false);

        // Ensure the function is accessible
    address proposalOwner = fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle);
    // Act
    FullDaoContract.VoteDetails[] memory votes = fullDaoContract.getVotes(fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));

    // Assert
    assertEq(votes.length, 2);
    assertEq(votes[0].voterAddr, address(this));
    assertEq(votes[0].pOwner, fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[0].voteType, true);
    assertEq(votes[1].voterAddr, address(this));
    assertEq(votes[1].pOwner, fullDaoContract.findProposalOwnerByTitle(daoMultiSigAddr, pTitle));
    assertEq(votes[1].voteType, false);
}
    // Retrieving all proposals for a specific DAO should return the correct list of ProposalDetails
function test_retrieve_all_proposals_for_dao() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    address daoMultiSigAddr = address(0x456);

    // Add proposals to the DAO
    fullDaoContract.addProposal(daoMultiSigAddr, "Proposal 1", "Summary 1", "Description 1", 3600);
    fullDaoContract.addProposal(daoMultiSigAddr, "Proposal 2", "Summary 2", "Description 2", 7200);

    // Act
    FullDaoContract.ProposalDetails[] memory proposals = fullDaoContract.getProposals(daoMultiSigAddr);

    // Assert
    assertEq(proposals.length, 2);
    assertEq(proposals[0].pTitle, "Proposal 1");
    assertEq(proposals[1].pTitle, "Proposal 2");
    // Add more assertions based on the expected ProposalDetails
}
    // Retrieving a specific proposal by title should return the correct ProposalDetails
function test_retrieve_proposal_by_title() public {
    // Arrange
    fullDaoContract = new FullDaoContract();
    string memory _pTitle = "Test Proposal";
    string memory _pSummary = "Test Summary";
    string memory _pDescription = "Test Description";
    uint256 _duration = 3600;
    address _daoMultiSigAddr = address(0x456);

    // Act
    fullDaoContract.addProposal(_daoMultiSigAddr, _pTitle, _pSummary, _pDescription, _duration);

    // Assert
    FullDaoContract.ProposalDetails memory retrievedProposal = fullDaoContract.getProposalByTitle(_daoMultiSigAddr, _pTitle);
    assertEq(retrievedProposal.pTitle, _pTitle);
    assertEq(retrievedProposal.pSummary, _pSummary);
    assertEq(retrievedProposal.pDescription, _pDescription);
    // Additional assertions can be added based on the specific fields of ProposalDetails
}
    }
