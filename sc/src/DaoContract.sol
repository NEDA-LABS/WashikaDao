//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DaoContract {
    enum Role {
        member,
        sponsor,
        founder
    }

    //MEMBER DETAILS
    uint256 phoneNo;
    string memberName;
    string idNo;
    string email;
    address memberAddr;
    //string role; -> ENUM instead

    //DAO DETAILS
    string daoName;
    string location;
    string targetAudience;
    string daoTitle;
    string daoDescription;
    string daoOverview;
    string daoImage;
    address multiSigAddr;

    //whitelisted addresses

    address[] public daoMultisigs; //Array containing dao multisig addresses
        //instead of all that shit, let only the multisig be able to add members
    //refactor to add a struct that keeps track of the roles
    //Lets keep track of each multisig & their members
    mapping(address daoMultisigAddr => address[] daoMembers) daoToMembers;
    //You can keep track of the roles by having a mapping from address to role, then use functions to enforce the necessary checks
    //keep track of each multisig & their blacklisted members / bad actors
    mapping(address daoMultisigs => address[] daoBlackList) eachDaoToItsBlackList;

    //Keep track of whitelisted members of a DAO, if your address is in the whitelist, you are all approved and set to join
    mapping(address daoMultisigAddr => address[] daoWhiteList) eachDaoToWhiteList;

    Role public userRole;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner, "OnlyOwnerCanCallThisFunction");
        _;
    }

    event DAOCreated(address indexed multiSigAddr, string name, string daoDescription);
    /*
    * Onchain, only crucial information about the DAO will be held, the rest will be handled and filtered within the backend to keep the contract cheap and minimal
    *DETAILS FILTERED IN BACKEND: location, title, overview, image{ipfsHash}
    */

    function _createDAO(
        string memory _daoName,
        string memory _targetAudience,
        string memory _daoDescription,
        address _multisigAddr
    ) public {
        daoName = _daoName;
        targetAudience = _targetAudience;
        daoDescription = _daoDescription;
        multiSigAddr = _multisigAddr;

        emit DAOCreated(multiSigAddr, daoName, daoDescription);
    }

    //A modifier to check that the caller actually has permission to call and the dao is actually a dao
    modifier onlyOwnerAndRealDao(address _fnCaller, address _daoWantToJoin) {
        //checking for zero address first
        require(_fnCaller != address(0), "NotTheZeroAddressHere");
        require(_daoWantToJoin != address(0), "CantJoinZeroAddress");

        for (uint256 i = 0; i < daoMultisigs.length; i++) {
            require(daoMultisigs[i] == _daoWantToJoin, "DAONotLegit");
            require(daoMultisigs[i] == _fnCaller, "YouKnowYouCantDoThis");
        }
        _;
    }

    //in the backend, ensure that whoever calls this function is logged in to a specific dao, the contract will check if is admin
    /**
     * onchain: only necessary details will be put, the backend will sanitize the rest
     * Details The Backend Will Sanitize: _phoneNo, _memberName, _idNo, _email,
     * We Use the _memberAddr, _email & _role on the blockchain
     */
    event MemberAdded(address indexed _memberAddr, string _email, Role _role);

    function addMember(
        string memory _email,
        address _memberAddr,
        address _callerAddr,
        address _daoToJoinMultisig,
        Role _role
    ) public onlyOwnerAndRealDao(msg.sender, _daoToJoinMultisig) {
        _callerAddr = msg.sender;
        email = _email;
        memberAddr = _memberAddr;
        userRole = _role;

        //Now adding them to our mapping
        daoToMembers[_daoToJoinMultisig].push(_memberAddr);
        emit MemberAdded(_memberAddr, _email, _role); //Note that since the mapping only stores some things and not really the role, the backend will have to take a hit for some of this stuff, limiting interactions and performing a system of checks. The mapping really only helps to keep track of who are members and simplify the overall authentication system but really limited in scope of the inherently entrenched permissions necessary for security measures
    }
    //checking if particular member is a member of a given dao{very good for testing}
    //  mapping(address daoMultisigAddr => address[] daoMembers) daoToMembers

    function isDaoMember(address _memberToCheck, address _daoMultiSig) public view returns (bool isMember) {
        //iterating over the dao members mapping
        for (uint256 i = 0; i < daoToMembers[_daoMultiSig].length; i++) {
            if (daoToMembers[_daoMultiSig][i] == _memberToCheck) {
                return true; //Yes is an actual Member
            }
        }
        return false; //Definitely not a member
    }

    event requestedJoinDao(address indexed multiSigAddr, address indexed requester, Role indexed _role);
    //use backend to ensure the dao address exists
    /*
    *name, phoneNo will be cross-checked & handled in the backend  in order to maintain minimal contract
    */

    function requestToJoinDao(address _multiSigAddr, address _requester, Role _role) public {
        Role requestingRole = _role;
        _requester = msg.sender;
        _multiSigAddr = owner;

        emit requestedJoinDao(_multiSigAddr, _requester, requestingRole);
    }

    //st, you are all approved and set to join
    //    mapping(address daoMultisigAddr => address[] daoWhiteList) eachDaoToWhiteList;
    event WhiteListed(address indexed addrAdded, address indexed daoWhiteListedAt);
    //refactor to private

    function whiteListMember(address _addrToAdd, address _daoMultiSig, address _caller)
        public
        onlyOwnerAndRealDao(_caller, _daoMultiSig)
    {
        _caller = msg.sender;
        require(_addrToAdd != address(0), "NotTheZeroAddress");
        eachDaoToWhiteList[_daoMultiSig].push(_addrToAdd);
        emit WhiteListed(_addrToAdd, _daoMultiSig);
    }

    //    mapping(address daoMultisigs => address[] daoBlackList) eachDaoToItsBlackList;
    event BlackListed(address indexed _memberToBeAdded, address indexed _daoMultiSig);

    function addToBlackList(address _caller, address _memberToBeAdded, address _daoMultiSig)
        public
        onlyOwnerAndRealDao(_caller, _daoMultiSig)
    {
        eachDaoToItsBlackList[_daoMultiSig].push(_memberToBeAdded);
        emit BlackListed(_memberToBeAdded, _daoMultiSig);
    } //more measures to limit functionality of BlackListed Addresses will be added in due course

    function checkIfInBlackList(address _addrToCheck, address _daoMultiSig) public view returns (bool isBlackListed) {
        require(_addrToCheck != address(0), "NotTheZeroAddress");

        for (uint256 i = 0; i < eachDaoToItsBlackList[_daoMultiSig].length; i++) {
            if (eachDaoToItsBlackList[_daoMultiSig][i] == _addrToCheck) {
                return true; //Yes this address is blacklisted
            }
        }
        return false; //No not blacklisted
    }

    //setters and getters for the function
    // mapping(address daoMultisigAddr => address[] daoMembers) daoToMembers;
}
