//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13; 
/**This Contract contains the entire application logic & will not be pushed to mainnet due to lack of privacy compliance, security & huge gas costs both to the platform & users, the backend will handle ux + privacy + scaling + gas optimization by activity optimization */
contract FullDaoContract {
    enum Role {
        member, 
        funder,//sponsor
        founder
    }
    enum ProposalStatus{
        active,
        voted,
        archived//voting period has already past or quorum achieved 
    }
    
        //MEMBER DETAILS
        struct MemberDetails {
            string memberName;
            string emailAddress;
            uint256 phoneNumber; 
            uint256 nationalId; 
            Role role; 
            address userAddress;
            address daoMultiSigAddr;//Dao to which this member is associated with -- dao can only have one multisig address 
            uint256 multiSigPhoneNo; //also dao for which this member is associated with -- dao can only have one multisig phone
        }
        MemberDetails[] public memberDetails;
        //string role; -> ENUM instead
    
    struct DaoDetails{
        string daoName; 
        string location; 
        string targetAudience;
        string daoTitle;
        string daoDescription; 
        string daoOverview; 
        string daoImageUrlHash; 
        address multiSigAddr;//Generally dao address 
        uint256 multiSigPhoneNo;
        bytes32 daoIdentifier;
    }
    DaoDetails[] public  daoList;//Array to store multiple DAO details 

    struct ProposalDetails {
            address pOwner; 
            address daoMultiSigAddr;
            string pTitle;
            string pSummary; 
            string pDescription; 
            uint256 expirationTime;
    }
    ProposalDetails[] public proposalDetailsList; 

    struct VoteDetails{
            address voterAddr;
            address pOwner; 
            bool voteType;//true -> Yes, false -> No 
    }
    VoteDetails[] public voteDetailsList;

    mapping(address multiSigAddress => uint256 phoneNumber) MsigToPhoneNumber; //A phone number can be used as a dao multiple-sig address 
    mapping(address inputAddr => bool isMultiSig) MultisigTracker;
    mapping(address userAddr => string emailAddr) AddrToEmail; 
    //creating a proposal should return a string named proposalIdentifier proposalId; 
    mapping(string proposalIdentifier => uint256 numVotes) VoteTracker;
    mapping(address userAddr => bytes daoIdentifier) UsrToDaoId; 
    mapping(address userAddr => bool isWhiteList) WhiteListTracker;
    mapping(address userAddr => bool isBlackList) BlackListTracker; 
    mapping(address userAddr => bool isDaoMember) DaoMemberTracker;
    mapping(uint256 phoneNumber => bool isMsig) PhoneNumberMsigTracker;

    mapping(address daoMsig=> MemberDetails[]) private daoMembers;//mapping from a dao multisig to its members  
      // Mapping from DAO multisig address to its proposals
    mapping(address => ProposalDetails[]) private daoProposals;

    // Mapping from proposal owner address to its votes
    mapping(address => VoteDetails[]) private proposalVotes;
    //Dao multisigs present 
    address[] public daoMultisigs;//Array containing dao multisig addresses 

        Role public userRole;
        address owner;

    constructor(){
       // owner = msg.sender;
    }

    function _generateRandomIds() public view returns(bytes32) {
        bytes32 randId = (keccak256(abi.encodePacked(block.timestamp, block.gaslimit, block.number, msg.sender)));
        return randId; 
    }

     event DAOCreated (address indexed multiSigAddr, string name, string daoDescription); 
      /**
     * @dev Function to create a new DAO.
     * @param _daoName Name of the DAO.
     * @param _location Location of the DAO.
     * @param _targetAudience Target audience of the DAO.
     * @param _daoTitle Title of the DAO.
     * @param _daoDescription Description of the DAO.
     * @param _daoOverview Overview of the DAO.
     * @param _daoImageUrlHash Hash of the DAO image URL.
     * @param _multiSigAddr Address of the DAO's multi-signature wallet.
     * @param _multiSigPhoneNo Phone number associated with the DAO's multi-signature wallet.
     * @return A new instance of DaoDetails.
     */
    
    function createDao(
        string memory _daoName,
        string memory _location,
        string memory _targetAudience,
        string memory _daoTitle,
        string memory _daoDescription,
        string memory _daoOverview,
        string memory _daoImageUrlHash,
        address _multiSigAddr,
        uint256 _multiSigPhoneNo
       // bytes memory _daoIdentifier
    ) public {
        bytes32 _daoIdentifier = _generateRandomIds();
        // Create a new instance of DaoDetails
        DaoDetails memory newDao = DaoDetails({
            daoName: _daoName,
            location: _location,
            targetAudience: _targetAudience,
            daoTitle: _daoTitle,
            daoDescription: _daoDescription,
            daoOverview: _daoOverview,
            daoImageUrlHash: _daoImageUrlHash,
            multiSigAddr: _multiSigAddr,
            multiSigPhoneNo: _multiSigPhoneNo,
            daoIdentifier: _daoIdentifier
        });

        // Add the new DAO to the daoList
        daoList.push(newDao);

        emit DAOCreated(_multiSigAddr, _daoName, _daoDescription);
    }

    // Function to retrieve DAO details by index
    function getDaoByMultiSig(address _multiSigAddr) public view returns (DaoDetails memory) {
        //require the address passed is a multisig 
        for (uint256 i = 0; i < daoList.length;i++) {
            if (daoList[i].multiSigAddr == _multiSigAddr) {
                return daoList[i];
            }
        }
        revert("DaoNotFoundError");
    }
   
   //function to set phone number for a given multiSig address 
   function setMsigToPhoneNumber(address _multiSigAddr, uint256 _phoneNumber) public {
        MsigToPhoneNumber[_multiSigAddr] = _phoneNumber;
        PhoneNumberMsigTracker[_phoneNumber] = true;
   }
   
   //function to get the phone number for a given multiSig address 
   function getMsigToPhoneNumber(address _multiSigAddr) public view returns (uint256) {
        return MsigToPhoneNumber[_multiSigAddr];
   }

    //function to check if a particular phone number is mapped to a multiSig address 
    function isPhoneNumberMappedToMsig(uint256 _phoneNumber) public view returns (bool) {
        // Iterate through all known multisig addresses
        if (PhoneNumberMsigTracker[_phoneNumber] == true) {
            return true;
        }
        return false; // Phone number not found
    }
   
   //function to check if a certain address is a multisig 
   function isAddrMultiSig(address _address) public view returns (bool) {
        if (MultisigTracker[_address] == true) { 
            return true;//yes its  a multisig 
   }
   return false; //definitely not a multisig 
   }
 
    event MemberAdded(address indexed _memberAddr, string _email, Role _role);
     // Function to add a member to a DAO
    function addMember(
        string memory _memberName,
        string memory _emailAddress,
        uint256 _phoneNumber,
        uint256 _nationalId,
        Role _role,
        address _userAddress,
        address _daoMultiSigAddr,
        uint256 _multiSigPhoneNo
    ) public {
        // Ensure the DAO address is valid
        require(_daoMultiSigAddr != address(0), "Invalid DAO multisig address");

        // Create a new member instance
        MemberDetails memory newMember = MemberDetails({
            memberName: _memberName,
            emailAddress: _emailAddress,
            phoneNumber: _phoneNumber,
            nationalId: _nationalId,
            role: _role,
            userAddress: _userAddress,
            daoMultiSigAddr: _daoMultiSigAddr,
            multiSigPhoneNo: _multiSigPhoneNo
        });

        // Add the new member to the DAO's member list
        daoMembers[_daoMultiSigAddr].push(newMember); 
        //mapping(address userAddr => bool isDaoMember) DaoMemberTracker; 
        DaoMemberTracker[_userAddress] =  true;//setting our tracker to true then emitting an event 
        emit MemberAdded(_userAddress, _emailAddress, _role);
    }

      // Function to get all members of a DAO
    function getMembers(address _daoMultiSigAddr) public view returns (MemberDetails[] memory) {
        return daoMembers[_daoMultiSigAddr];
    }

     // Function to get the number of members in a DAO
    function getMemberCount(address _daoMultiSigAddr) public view returns (uint256) {
        return daoMembers[_daoMultiSigAddr].length;
    }

      // Function to get a specific member's details by phone number
    function getMemberByPhoneNumber(address _daoMultiSigAddr, uint256 _phoneNumber) public payable  returns (MemberDetails memory) {
        MemberDetails[] storage members = daoMembers[_daoMultiSigAddr];

        // Iterate through the members to find the one with the matching phone number
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].phoneNumber == _phoneNumber) {
                return members[i]; // Return the member details if found
            }
        }
        revert("Member with the specified phone number not found");
    }
       // Function to check if a specific address is a member of the DAO
    function isDaoMember(address _memberToCheck, address _daoMultiSig) public view returns (bool) {
        MemberDetails[] storage members = daoMembers[_daoMultiSig];

        // Iterate through the members to check if the address matches
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].userAddress == _memberToCheck) {
                return true; // Member found
            }
        }
        return false; // Member not found
    }

   
   //Proposals 

    // Function to add a proposal to a DAO
    function addProposal(
        address _daoMultiSigAddr,
        string memory _pTitle,
        string memory _pSummary,
        string memory _pDescription,
        uint256 _duration //Duration in seconds 
    ) public {
        require(_daoMultiSigAddr != address(0), "Invalid DAO multisig address");
        //checks that the address creating proposal is in the dao  
        bool isUserDaoMember =  isDaoMember(address(msg.sender), _daoMultiSigAddr);
        require(isUserDaoMember != false, "YouHaveToBeADaoMemberToCreateProposal");//Redirect to request to join dao for which the multisig they were trying
          // Calculate expiration time
        uint256 expirationTime = block.timestamp + _duration;
        // Create a new proposal instance
        ProposalDetails memory newProposal = ProposalDetails({
            pOwner: msg.sender,
            daoMultiSigAddr: _daoMultiSigAddr,
            pTitle: _pTitle,
            pSummary: _pSummary,
            pDescription: _pDescription,
            expirationTime: expirationTime
        });

        // Add the new proposal to the DAO's proposal list
        daoProposals[_daoMultiSigAddr].push(newProposal);
    }

    // Function to check if a proposal is expired by title
    function isProposalExpiredByTitle(address _daoMultiSigAddr, string memory _pTitle) public view returns (bool) {
        ProposalDetails[] storage proposals = daoProposals[_daoMultiSigAddr];

        // Iterate through the proposals to find the one with the matching title
        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i].pTitle)) == keccak256(abi.encodePacked(_pTitle))) {
                return block.timestamp > proposals[i].expirationTime; // Check if the current time is past the expiration time
            }
        }
        revert("Proposal with the specified title not found");
    }

     // Function to find proposal index by title or owner (can be implemented)
    function findProposalIndex(address _daoMultiSigAddr, address _proposalOwner) internal view returns (uint256) {
        ProposalDetails[] storage proposals = daoProposals[_daoMultiSigAddr];
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].pOwner == _proposalOwner) {
                return i;
            }
        }
        revert("Proposal not found");
    }

     // Function to check if a proposal is expired
    function isProposalExpired(address _daoMultiSigAddr, uint256 index) public view returns (bool) {
        require(index < daoProposals[_daoMultiSigAddr].length, "Index out of bounds");
        ProposalDetails storage proposal = daoProposals[_daoMultiSigAddr][index];
        return block.timestamp > proposal.expirationTime; // Check if the current time is past the expiration time
    }

 // Function to cast a vote on a proposal
    function castVote(address _daoMultiSigAddr, string memory _pTitle, bool _voteType) public {
        require(isDaoMember(msg.sender, _daoMultiSigAddr), "Only DAO members can vote");
        require(!isProposalExpiredByTitle(_daoMultiSigAddr, _pTitle), "Proposal is expired");

        // Create a new vote instance
        VoteDetails memory newVote = VoteDetails({
            voterAddr: msg.sender,
            pOwner: findProposalOwner(_daoMultiSigAddr, _pTitle),
            voteType: _voteType
        });

        // Add the new vote to the proposal's vote list
        proposalVotes[newVote.pOwner].push(newVote);
    }


    // Function to find the proposal owner by title
    function findProposalOwner(address _daoMultiSigAddr, string memory _pTitle) internal view returns (address) {
        ProposalDetails[] storage proposals = daoProposals[_daoMultiSigAddr];

        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i].pTitle)) == keccak256(abi.encodePacked(_pTitle))) {
                return proposals[i].pOwner; // Return the owner of the proposal
            }
        }
        revert("Proposal with the specified title not found");
    }

     // Function to get all votes for a specific proposal
    function getVotes(address _proposalOwner) public view returns (VoteDetails[] memory) {
        return proposalVotes[_proposalOwner];
    }

       // Function to get all proposals of a DAO
    function getProposals(address _daoMultiSigAddr) public view returns (ProposalDetails[] memory) {
        return daoProposals[_daoMultiSigAddr];
    }

        // Function to get a specific proposal by title
    function getProposalByTitle(address _daoMultiSigAddr, string memory _pTitle) public view returns (ProposalDetails memory) {
        ProposalDetails[] storage proposals = daoProposals[_daoMultiSigAddr];

        // Iterate through the proposals to find the one with the matching title
        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i].pTitle)) == keccak256(abi.encodePacked(_pTitle))) {
                return proposals[i]; // Return the proposal details if found
            }
        }
        revert("Proposal with the specified title not found");
    }
 
}