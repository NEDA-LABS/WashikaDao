//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
/**This Contract contains the entire application logic & will not be pushed to mainnet due to lack of privacy compliance, security & huge gas costs both to the platform & users, the backend will handle ux + privacy + scaling + gas optimization by activity optimization */
  /** Alfajores contract address 0x50d92eA99AF339519Cd060c73d2DB24620AF2f57 **/
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
        //bytes32 daoIdentifier;
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

    event DAOCREATED (address indexed multiSigAddr, string name, string daoDescription);
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
     * returns A new instance of DaoDetails.
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
      //  bytes32 _daoIdentifier = _generateRandomIds();
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
            multiSigPhoneNo: _multiSigPhoneNo
            //daoIdentifier: _daoIdentifier
        });

        // Add the new DAO to the daoList
        daoList.push(newDao);

        emit DAOCREATED(_multiSigAddr, _daoName, _daoDescription);
    }
    /**
     * @dev Function to retrieve DAO details by multi-signature wallet address.
     * @param _multiSigAddr Address of the DAO's multi-signature wallet.
     * @return A struct containing the DAO details. If the DAO is not found, it reverts with "DaoNotFoundError".
     */
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
    /**
    * @dev Function to map a phone number to a DAO's multi-signature wallet address.
    * @param _multiSigAddr Address of the DAO's multi-signature wallet.
    * @param _phoneNumber Phone number associated with the DAO's multi-signature wallet.
    * return No return value.
    */
    function setMsigToPhoneNumber(address _multiSigAddr, uint256 _phoneNumber) public {
        MsigToPhoneNumber[_multiSigAddr] = _phoneNumber;
        PhoneNumberMsigTracker[_phoneNumber] = true;
   }

   //function to get the phone number for a given multiSig address
    /**
    * @dev Function to retrieve the phone number associated with a DAO's multi-signature wallet address.
    * @param _multiSigAddr Address of the DAO's multi-signature wallet.
    * @return The phone number associated with the given multi-signature wallet address.
    *         If the multi-signature wallet address is not found, it reverts with "MsigNotFoundError".
    */
   function getMsigToPhoneNumber(address _multiSigAddr) public view returns (uint256) {
        return MsigToPhoneNumber[_multiSigAddr];
   }

    //function to check if a particular phone number is mapped to a multiSig address
        /**
     * @dev Function to check if a particular phone number is mapped to a multiSig address.
     * @param _phoneNumber The phone number to check.
     * @return bool Returns true if the phone number is mapped to a multiSig address, false otherwise.
     */
    function isPhoneNumberMappedToMsig(uint256 _phoneNumber) public view returns (bool) {
        // Iterate through all known multisig addresses
        if (PhoneNumberMsigTracker[_phoneNumber] == true) {
            return true;
        }
        return false; // Phone number not found
    }
   //function to check if a certain address is a multisig
     /**
    * @dev Function to check if a certain address is a multisig.
    * @param _address The address to check.
    * @return bool Returns true if the address is a multisig, false otherwise.
    */
   function isAddrMultiSig(address _address) public view returns (bool) {
        if (MultisigTracker[_address] == true) {
            return true;//yes its  a multisig
   }
   return false; //definitely not a multisig
   }

    event MEMBERADDED(address indexed _memberAddr, string _email, Role _role);
     // Function to add a member to a DAO
      /**
     * @dev Function to add a member to a DAO.
     * @param _memberName Name of the member.
     * @param _emailAddress Email address of the member.
     * @param _phoneNumber Phone number of the member.
     * @param _nationalId National ID of the member.
     * @param _role Role of the member in the DAO.
     * @param _userAddress Ethereum address of the member.
     * @param _daoMultiSigAddr Ethereum address of the DAO's multi-signature wallet.
     * @param _multiSigPhoneNo Phone number associated with the DAO's multi-signature wallet.
     * return No return value.
     */
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
        emit MEMBERADDED(_userAddress, _emailAddress, _role);
    }

      // Function to get all members of a DAO
          /**
     * @dev Retrieves all members of a DAO associated with a specific multi-signature wallet address.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @return MemberDetails[] An array of MemberDetails structs representing the members of the DAO.
     *         If no members are found, an empty array is returned.
     */
    function getMembers(address _daoMultiSigAddr) public view returns (MemberDetails[] memory) {
        return daoMembers[_daoMultiSigAddr];
    }

     // Function to get the number of members in a DAO
      /**
     * @dev Retrieves the number of members in a DAO associated with a specific multi-signature wallet address.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @return uint256 The number of members in the DAO.
     */
    function getMemberCount(address _daoMultiSigAddr) public view returns (uint256) {
        return daoMembers[_daoMultiSigAddr].length;
    }

      // Function to get a specific member's details by phone number
       /**
     * @dev Retrieves a member's details by phone number from a specific DAO.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _phoneNumber Phone number of the member to retrieve.
     * @return MemberDetails Returns the member's details if found.
     *         If the member is not found, it reverts with "Member with the specified phone number not found".
     */
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
        /**
     * @dev Checks if a specific address is a member of the DAO associated with a specific multi-signature wallet address.
     * @param _memberToCheck Ethereum address of the member to check.
     * @param _daoMultiSig Ethereum address of the DAO's multi-signature wallet.
     * @return bool Returns true if the member is found, false otherwise.
     */
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


   //Proposals --------------------------------------------------------------------------------------------------------------------------------------------------------------
      /**
     * @dev Function to add a proposal to a DAO.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _pTitle Title of the proposal.
     * @param _pSummary Summary of the proposal.
     * @param _pDescription Description of the proposal.
     * @param _duration Duration in seconds for the proposal to be active.
     * return no return value.
     */
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
        require(isUserDaoMember != true, "YouHaveToBeADaoMemberToCreateProposal");//Redirect to request to join dao for which the multisig they were trying
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
    /**
     * @dev Function to check if a proposal is expired by title.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _pTitle Title of the proposal.
     * @return bool Returns true if the proposal is expired, false otherwise.
     *         If the proposal is not found, it reverts with "Proposal with the specified title not found".
     */
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
       /**
     * @dev Function to find the index of a proposal in a DAO's proposal list.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _proposalOwner Ethereum address of the proposal owner.
     * @return uint256 Returns the index of the proposal in the DAO's proposal list.
     *         If the proposal is not found, it reverts with "Proposal not found".
     */
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
         /**
     * @dev Function to check if a proposal is expired.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param index Index of the proposal in the DAO's proposal list.
     * @return bool Returns true if the proposal is expired, false otherwise.
     *         If the index is out of bounds, it reverts with "Index out of bounds".
     */
       //address pOwner;
        //    address daoMultiSigAddr;
         //   string pTitle;
          //  string pSummary;
           // string pDescription;
           // uint256 expirationTime;
    function isProposalExpired(address _daoMultiSigAddr, uint256 index) public view returns (bool) {
        require(index < daoProposals[_daoMultiSigAddr].length, "Index out of bounds");
        ProposalDetails storage proposal = daoProposals[_daoMultiSigAddr][index];
        if (proposal.expirationTime < block.timestamp + proposal.expirationTime) {
          return false;
        }
        return true; // Check if the current time is past the expiration time
    }
      /**
     * @dev Function to cast a vote on a proposal.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _pTitle Title of the proposal.
     * @param _voteType Type of vote (true for yes, false for no).
     * return No return value.
     * @dev The function checks if the caller is a DAO member and if the proposal is not expired.
     *      If the conditions are met, a new vote is created and added to the proposal's vote list.
     */
    function castVote(address _daoMultiSigAddr, string memory _pTitle, bool _voteType) public {
        require(isDaoMember(msg.sender, _daoMultiSigAddr), "Only DAO members can vote");
        require(!isProposalExpiredByTitle(_daoMultiSigAddr, _pTitle), "Proposal is expired");

        // Create a new vote instance
        VoteDetails memory newVote = VoteDetails({
            voterAddr: msg.sender,
            pOwner: findProposalOwnerByTitle(_daoMultiSigAddr, _pTitle),
            voteType: _voteType
        });

        // Add the new vote to the proposal's vote list
        proposalVotes[newVote.pOwner].push(newVote);
    }
    /**
     * @dev Function to find the proposal owner by title.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _pTitle Title of the proposal.
     * @return address Returns the Ethereum address of the proposal owner.
     *         If the proposal is not found, it reverts with "Proposal with the specified title not found".
     */
    function findProposalOwnerByTitle(address _daoMultiSigAddr, string memory _pTitle) public view returns (address) {
        ProposalDetails[] storage proposals = daoProposals[_daoMultiSigAddr];

        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i].pTitle)) == keccak256(abi.encodePacked(_pTitle))) {
                return proposals[i].pOwner; // Return the owner of the proposal
            }
        }
        revert("Proposal with the specified title not found");
    }
      /**
     * @dev Function to retrieve all votes for a specific proposal.
     * @param _proposalOwner Ethereum address of the proposal owner.
     * @return VoteDetails[] An array of VoteDetails structs representing the votes for the proposal.
     *         If no votes are found, an empty array is returned.
     */
    function getVotes(address _proposalOwner) public view returns (VoteDetails[] memory) {
        return proposalVotes[_proposalOwner];
    }
        /**
     * @dev Retrieves all proposals associated with a specific DAO.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @return ProposalDetails[] An array of ProposalDetails structs representing the proposals of the DAO.
     *         If no proposals are found, an empty array is returned.
     */
    function getProposals(address _daoMultiSigAddr) public view returns (ProposalDetails[] memory) {
        return daoProposals[_daoMultiSigAddr];
    }

            /**
     * @dev Retrieves a specific proposal by title from a specific DAO.
     * @param _daoMultiSigAddr Address of the DAO's multi-signature wallet.
     * @param _pTitle Title of the proposal.
     * @return ProposalDetails Returns the details of the proposal if found.
     *         If the proposal is not found, it reverts with "Proposal with the specified title not found".
     */
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
