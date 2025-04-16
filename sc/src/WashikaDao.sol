//SPDX-License-Identifier: WDOL-License
pragma solidity ^0.8.3;

/// @title WashikaDao Mainnet V1.0 Contract
/// @author M3STK41T7K4L K.E
/// @notice Handles all the Onchain Operations/Services Offered by the Washika Dao Platform.
/// @dev Mainnet V1.0 Smart Contract for all the Onchain Operations

contract WashikaDao {
    struct DaoDetails {
        string daoName;
        string daoLocation;
        string daoObjective;
        string daoTargetAudience;
        address daoCreator;
        bytes32 daoId;
    }

    DaoDetails[] public platformDaoList;

    struct MemberDetails {
        string memberEmail;
        address memberAddress; //Identifier for the member
    }

    MemberDetails[] public memberDetails;

    struct ProposalDetails {
        address proposalOwner;
        address daoAddress; // Address of the Dao that contains the Proposal
        bytes32 proposalId; // Identifier for the Proposal
        bytes32 daoId;
        string proposalUrl;
        string proposalTitle; // IPFS url containing read/reference to the proposal
        string proposalStatus; // Status of the Proposal
        uint256 proposalCreatedAt;
    }

    ProposalDetails[] public platformProposalList;

    struct VoteDetails {
        address voterAddress;
        bytes32 proposalId;
        bytes32 daoId;
        bytes32 voteId;
        bool voteType; // true -> Yes, false -> No
    }

    VoteDetails[] public voteDetails;

    //Mappings
    mapping(address daoCreator => address daoAddress) OwnerToDao; // Owner to Dao Address
    mapping(address daoCreator => bytes32[] daoId) CreatorToDaoIds;
    mapping(bytes32 daoId => address daoCreator) DaoIdToCreator;
    mapping(address daoAddress => address daoMultiSig) DaosToMultiSig; // Daos and their MultiSigs
    mapping(address daoAddress => bytes32 daoId) DaoAddressToId;
    mapping(bytes32 daoId => address daoMultiSig) DaosByIdToMultiSig;
    mapping(address daoMultiSig => bytes32 daoId) MultiSigToDaoId;
    mapping(bytes32 daoId => address[] memberAddress) DaoIdToMember;
    mapping(bytes32 daoId => string memberEmail) DaoIdToEmail; //Dao id to email of member
    mapping(bytes32 daoId => address daoAddress) DaoIdToAddress;
    mapping(address daoMember => address daoAddress) MemberToDao; //member to Dao they are members of
    mapping(address daoAddress => bytes32 proposalId) DaosToProposalId; // Daos and their proposal Ids
    mapping(bytes32 proposalId => address daoAddress) ProposalIdToDaoAddr;
    mapping(bytes32 proposalId => bytes32 daoId) ProposalIdToDaoId;
    mapping(string proposalTitle => bytes32 proposalId) ProposalTitleToId;
    mapping(bytes32 proposalId => address proposalOwner) ProposalIdToOwnerAddress;
    mapping(bytes32 daoId => bytes32 proposalId) DaoIdToProposalId;
    mapping(address daoAddress => mapping(address proposalOwner => bytes32 proposalId)) DaosToProposalOwnersToProposalId;
    mapping(address voterAddress => mapping(address daoAddress => bytes32 proposalId)) VoterToDaoToProposalId;
    mapping(address userAddress => mapping(bytes32 proposalId => bool voted)) public hasVoted; //  member address => proposal ID => has voted?
    mapping(address => mapping(bytes32 => bytes32)) public UserAddressToProposalIdToVoteId;
    mapping(address daoAddress => MemberDetails[] members) private DaosToMembers;
    mapping(address daoAddress => ProposalDetails[]) private DaoProposals;
    mapping(address daoAddress => VoteDetails[]) private DaoVotes;

    mapping(bytes32 => mapping(address => bool)) public isMember;

    mapping(address userAddress => bool isWhiteList) WhiteListTracker;
    mapping(address userAddress => bool isBlackList) BlackListTracker;

    address contractOwner;

    constructor() {
        contractOwner = msg.sender;
    }
    // Events

    event DAOCREATED(bytes32 indexed daoId, address indexed daoCreator, string daoName);
    event PROPOSALCREATED(address indexed daoAddress, address indexed proposalCreator, bytes32 proposalId);
    event UPVOTED(address indexed voterAddress, address indexed daoAddress, bytes32 proposalId, bytes32 voteId);
    event DOWNVOTED(address indexed voterAddress, address indexed daoAddress, bytes32 proposalId, bytes32 voteId);
    event MEMBERADDED(bytes32 indexed daoId, address indexed userAddress);
    event WHITELISTED(address indexed daoAddress, address indexed whiteListedAddress);
    event BLACKLISTED(address indexed daoAddress, address indexed blackListedAddress);
    event DAOMSIGSET(bytes32 indexed daoId, address indexed daoMultiSig);
    event DAOADDRSET(address indexed daoCreator, address indexed daoAddress, bytes32 daoId);

    uint256 private _saltNum = 254;
    //TODO: Add MATHEMATICAL FUNCTION TO USE Z TO INCREASE RANDOMNESS
    // Utility function

    function _generateRandomIds() internal returns (bytes32) {
        bytes32 _randId =
            (keccak256(abi.encodePacked(block.timestamp, block.gaslimit, block.number, _saltNum, msg.sender)));
        _saltNum += 7;
        return _randId;
    }

    function createDao(
        string memory _daoLocation,
        string memory _daoObjective,
        string memory _daoTargetAudience,
        string memory _daoName
    ) public {
        bytes32 _daoId = _generateRandomIds();
        DaoDetails memory newDao = DaoDetails({
            daoName: _daoName,
            daoLocation: _daoLocation,
            daoObjective: _daoObjective,
            daoTargetAudience: _daoTargetAudience,
            daoCreator: msg.sender,
            daoId: _daoId
        });
        platformDaoList.push(newDao);
        CreatorToDaoIds[msg.sender].push(_daoId); // Add to array
        DaoIdToCreator[_daoId] = msg.sender;

        emit DAOCREATED(_daoId, msg.sender, _daoName);
    }

    function isDaoCreator(address _userAddress, bytes32 _daoId) public view returns (bool) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        if (DaoIdToCreator[_daoId] == _userAddress) {
            return true;
        }
        return false;
    }

    function getDaoIdsByCreatorAddress(address _creator) public view returns (bytes32[] memory) {
        require(_creator != address(0), "ZeroAddressNotAllowed");
        require(CreatorToDaoIds[_creator].length > 0, "NoDAOsFoundForThisCreator");
        return CreatorToDaoIds[_creator];
    }

    function getDaosInPlatformArr() public view returns (DaoDetails[] memory) {
        return platformDaoList;
    }

    function getDaoAddressByDaoId(bytes32 _daoId) public view returns (address) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        address daoAddress = DaoIdToAddress[_daoId];
        return daoAddress;
    }

    function getDaoIdByDaoAddress(address _daoAddress) public view returns (bytes32) {
        bytes32 __daoId = DaoAddressToId[_daoAddress];
        require(_isDaoIdValid(__daoId), "InvalidDaoIdLocated");
        return __daoId;
    }

    function getDaoCreatorByDaoId(bytes32 _daoId) public view returns (address) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        address __creatorAddress = DaoIdToCreator[_daoId];
        return __creatorAddress;
    }

    function getLatestDaoIdByCreatorX(address _creator) public view returns (bytes32) {
        bytes32[] storage daoIds = CreatorToDaoIds[_creator];
        require(daoIds.length > 0, "No DAOsfoundforthiscreator");
        return daoIds[daoIds.length - 1];
    }

    function setDaoAddress(address _daoAddress, bytes32 _daoId) public {
        require(_daoAddress != address(0), "ZeroAddressNotAllowed");
        require(isDaoCreator(msg.sender, _daoId) == true, "OnlyCreator");
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        DaoAddressToId[_daoAddress] = _daoId;
        DaoIdToAddress[_daoId] = _daoAddress;
        emit DAOADDRSET(msg.sender, _daoAddress, _daoId);
    }

    function setDaoMultiSigById(address _daoMultiSig, bytes32 _daoId) public {
        require(_daoMultiSig != address(0), "ZeroAddressNotAllowed");
        require(isDaoCreator(msg.sender, _daoId) == true, "OnlyCreator");
        require(!isMultiSigAlreadySet(_daoMultiSig, _daoId), "MSIGAlreadySet");
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        DaosByIdToMultiSig[_daoId] = _daoMultiSig;
        MultiSigToDaoId[_daoMultiSig] = _daoId;
        emit DAOMSIGSET(_daoId, _daoMultiSig);
    }

    function isMultiSigAlreadySet(address _daoMultiSig, bytes32 _daoId) public view returns (bool) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        if (DaosByIdToMultiSig[_daoId] == _daoMultiSig) {
            return true;
        }
        return false;
    }

    function _isDaoIdValid(bytes32 _daoId) internal view returns (bool) {
        if (DaoIdToCreator[_daoId] != address(0)) {
            return true;
        }
        return false;
    }

    function getDaoMultisigByDaoId(bytes32 _daoId) public view returns (address) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        address __daoMultiSig = DaosByIdToMultiSig[_daoId];
        return __daoMultiSig;
    }

    function addMemberToDao(string memory _memberEmail, address _memberAddress, bytes32 _daoId) public {
        require(_memberAddress != address(0), "ZeroAddressNotAllowed");
        require(isDaoCreator(msg.sender, _daoId) == true, "OnlyCreator");
        MemberDetails memory newMember = MemberDetails({memberEmail: _memberEmail, memberAddress: _memberAddress});
        memberDetails.push(newMember); //Tracking members and Daos
        DaoIdToMember[_daoId].push(_memberAddress);
        isMember[_daoId][_memberAddress] = true;

        DaoIdToEmail[_daoId] = _memberEmail;

        address daoAddress = DaoIdToAddress[_daoId];
        DaosToMembers[daoAddress].push(newMember); // Add member to the DAO's member list

        emit MEMBERADDED(_daoId, _memberAddress);
    }

    function getDaoMembers(bytes32 _daoId) public view returns (MemberDetails[] memory) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        address daoAddress = DaoIdToAddress[_daoId];
        return DaosToMembers[daoAddress];
    }

    function getMemberDetails(string memory _memberEmail) public view returns (MemberDetails[] memory) {
        MemberDetails[] memory matchingMembers = new MemberDetails[](0);
        for (uint256 i = 0; i < memberDetails.length; i++) {
            if (keccak256(bytes(memberDetails[i].memberEmail)) == keccak256(bytes(_memberEmail))) {
                // Create a new temporary array with one more element
                MemberDetails[] memory tempArray = new MemberDetails[](matchingMembers.length + 1);
                // Copy existing members to the new array
                for (uint256 j = 0; j < matchingMembers.length; j++) {
                    tempArray[j] = matchingMembers[j];
                }
                // Add the matching member
                tempArray[matchingMembers.length] = memberDetails[i];
                // Update the matchingMembers array
                matchingMembers = tempArray;
            }
        }
        return matchingMembers;
    }

    function isYMemberOfDaoX(bytes32 _daoId, address _userAddress) public view returns (bool) {
        require(_userAddress != address(0), "ZeroAddressNotAllowed");
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        return isMember[_daoId][_userAddress];
    }

    function createProposal(string memory _proposalUrl, string memory _proposalTitle, bytes32 _daoId) public {
        //Search for Dao Address and set it
        address _daoAddress = DaoIdToAddress[_daoId];
        require(isDaoCreator(msg.sender, _daoId) == true || isYMemberOfDaoX(_daoId, msg.sender), "OnlyMemberOrCreator");
        bytes32 _proposalId = _generateRandomIds();
        string memory _proposalStatus = "ACTIVE";
        //caller is the proposalOwner, set them here
        ProposalDetails memory newProposal = ProposalDetails({
            proposalOwner: msg.sender,
            daoAddress: _daoAddress,
            proposalUrl: _proposalUrl,
            proposalId: _proposalId,
            proposalTitle: _proposalTitle,
            proposalStatus: _proposalStatus,
            daoId: _daoId,
            proposalCreatedAt: block.timestamp
        });
        platformProposalList.push(newProposal);
        DaoProposals[_daoAddress].push(newProposal);
        //Update some proposal mappings
        DaosToProposalId[_daoAddress] = _proposalId;
        ProposalIdToDaoId[_proposalId] = _daoId;
        ProposalIdToDaoAddr[_proposalId] = _daoAddress;
        DaosToProposalOwnersToProposalId[_daoAddress][msg.sender] = _proposalId;
        ProposalTitleToId[_proposalTitle] = _proposalId;
        ProposalIdToOwnerAddress[_proposalId] = msg.sender;
        emit PROPOSALCREATED(_daoAddress, msg.sender, _proposalId);
    }

    function getProposals(bytes32 _daoId) external view returns (ProposalDetails[] memory) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        return DaoProposals[DaoIdToAddress[_daoId]];
    }

    function getProposalXById(bytes32 _proposalId) public view returns (ProposalDetails memory) {
        for (uint256 i = 0; i < platformProposalList.length; i++) {
            if (platformProposalList[i].proposalId == _proposalId) {
                return platformProposalList[i];
            }
        }
        revert("Proposalnotfound");
    }

    function getProposalIdByTitle(string memory _proposalTitle) public view returns (bytes32) {
        bytes32 __proposalId = ProposalTitleToId[_proposalTitle];
        return __proposalId;
    }

    function doesProposalXExistInDaoY(bytes32 _proposalId, bytes32 _daoId) public view returns (bool) {
         require(_isDaoIdValid(_daoId), "InvalidDaoId");
        if (ProposalIdToDaoId[_proposalId] == _daoId) {
            return true;
        } else {
            return false;
        }
    }

    function doesProposalTitleXExistinDaoIdY(string memory _proposalTitle, bytes32 _daoId) public view returns (bool) {
        require(_isDaoIdValid(_daoId), "InvalidDaoId");
        if (ProposalTitleToId[_proposalTitle] == _daoId) {
            return true;
        } else {
            return false;
        }
    }

    function doesProposalTitleXExistInDaoAddressY(string memory _proposalTitle, address _daoAddress)
        public
        view
        returns (bool)
    {
        bytes32 __proposalId = getProposalIdByTitle(_proposalTitle);
        if (ProposalIdToDaoAddr[__proposalId] == _daoAddress) {
            return true;
        } else {
            return false;
        }
    }
    function getProposalOwnerById(bytes32 _proposalId) public view returns (address) {
        address __proposalOwner = ProposalIdToOwnerAddress[_proposalId];
        return __proposalOwner;
    }

    function getProposalOwnerByTitle(string memory _proposalTitle) public view returns (address) {
        bytes32 __proposalId = getProposalIdByTitle(_proposalTitle);
        address __proposalOwner = getProposalOwnerById(__proposalId);
        return __proposalOwner;
    }

    function upVote(bytes32 _proposalId, bytes32 _daoId) public {
        require(isMember[_daoId][msg.sender], "OnlyMember"); // Constant time look up
        require(!hasVoted[msg.sender][_proposalId], "VoterFraudAttemptDontTryAgain");
        bytes32 voteId = _generateRandomIds();
        VoteDetails memory newVote = VoteDetails({
            voterAddress: msg.sender,
            proposalId: _proposalId,
            daoId: _daoId,
            voteId: voteId,
            voteType: true
        });
        voteDetails.push(newVote);
        DaoVotes[ProposalIdToDaoAddr[_proposalId]].push(newVote);
        hasVoted[msg.sender][_proposalId] = true; // Update the mapping
        UserAddressToProposalIdToVoteId[msg.sender][_proposalId] = voteId; // Store the voteId
        emit UPVOTED(msg.sender, ProposalIdToDaoAddr[_proposalId], _proposalId, voteId);
    }

    function downVote(bytes32 _proposalId, bytes32 _daoId) public {
        require(isMember[_daoId][msg.sender], "OnlyMember"); // Constant time look up
        require(!hasVoted[msg.sender][_proposalId], "VoterFraudAttemptDontTryAgain");
        bytes32 voteId = _generateRandomIds();
        VoteDetails memory newVote = VoteDetails({
            voterAddress: msg.sender,
            proposalId: _proposalId,
            daoId: _daoId,
            voteId: voteId,
            voteType: false
        });
        voteDetails.push(newVote);
        DaoVotes[ProposalIdToDaoAddr[_proposalId]].push(newVote);
        hasVoted[msg.sender][_proposalId] = true; // Update the mapping
        UserAddressToProposalIdToVoteId[msg.sender][_proposalId] = voteId; // Store the voteId
        emit DOWNVOTED(msg.sender, ProposalIdToDaoAddr[_proposalId], _proposalId, voteId);
    }

    function getUpVotes(bytes32 _proposalId) public view returns (uint256) {
        uint256 upVotes = 0;
        VoteDetails[] memory votes = DaoVotes[ProposalIdToDaoAddr[_proposalId]];
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voteType) {
                upVotes++;
            }
        }
        return upVotes;
    }

    function getDownVotes(bytes32 _proposalId) public view returns (uint256) {
        uint256 downVotes = 0;
        VoteDetails[] memory votes = DaoVotes[ProposalIdToDaoAddr[_proposalId]];
        for (uint256 i = 0; i < votes.length; i++) {
            if (!votes[i].voteType) {
                downVotes++;
            }
        }
        return downVotes;
    }

    function getVoteXById(bytes32 _voteId) public view returns (VoteDetails memory) {
        for (uint256 i = 0; i < voteDetails.length; i++) {
            if (voteDetails[i].voteId == _voteId) {
                return voteDetails[i];
            }
        }
        revert("Votenotfound");
    }

    function getVoteIdByUserAddress(address _userAddress, bytes32 _proposalId) public view returns (bytes32) {
        return UserAddressToProposalIdToVoteId[_userAddress][_proposalId];
    }

    // Internal helper function to update proposal status
    function _updateProposalStatus(bytes32 _proposalId, string memory _newStatus) internal {
        for (uint256 i = 0; i < platformProposalList.length; i++) {
            if (platformProposalList[i].proposalId == _proposalId) {
                platformProposalList[i].proposalStatus = _newStatus;
                DaoProposals[ProposalIdToDaoAddr[_proposalId]][i].proposalStatus = _newStatus; // Update in the DAO-specific mapping as well
                break;
            }
        }
    }

    function calculateProposalOutcome(bytes32 _proposalId) public {
        // 1. Get the proposal details
        ProposalDetails memory proposal = getProposalXById(_proposalId);

        // 2. Calculate the proposal end time (creation time + 48 hours)
        uint256 proposalEndTime = proposal.proposalCreatedAt + 48 hours;

        // 3. Check if the voting period has ended
        require(block.timestamp > proposalEndTime, "WrongActionVotingInProgress");
        require(keccak256(bytes(proposal.proposalStatus)) == keccak256(bytes("ACTIVE")), "VotingAlreadyEnded");

        // 4. Get the proposal outcome
        string memory outcome = getProposalOutcome(_proposalId);

        // 5. Update the proposal status based on the outcome
        if (keccak256(bytes(outcome)) == keccak256(bytes("Approved"))) {
            _updateProposalStatus(_proposalId, "APPROVED");
        } else if (keccak256(bytes(outcome)) == keccak256(bytes("Rejected"))) {
            _updateProposalStatus(_proposalId, "REJECTED");
        } else {
            _updateProposalStatus(_proposalId, "TIED");
        }

        // 6. Set the proposal status to ARCHIVED to prevent further voting
        _updateProposalStatus(_proposalId, "ARCHIVED");
    }

    function getProposalOutcome(bytes32 _proposalId) public view returns (string memory) {
        uint256 upVotes = getUpVotes(_proposalId);
        uint256 downVotes = getDownVotes(_proposalId);
        if (upVotes > downVotes) {
            return "Approved";
        } else if (downVotes > upVotes) {
            return "Rejected";
        } else {
            return "Tied";
        }
    }

    function isDaoMember(address _member, bytes32 _proposalId) internal view returns (bool) {
        address daoAddress = ProposalIdToDaoAddr[_proposalId];
        MemberDetails[] memory members = DaosToMembers[daoAddress];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == _member) {
                return true;
            }
        }
        return false;
    }
}
