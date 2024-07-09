 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract DaoFactory {
    enum Roles {
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
        string role;

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
      address[] public membersToAllow;

   address owner;

    constructor(){
        owner = msg.sender;
    }

    modifier  onlyAdmin() {
        require(msg.sender == owner, "OnlyOwnerCanCallThisFunction");
        _;
    }

     event DAOCreated (address indexed multiSigAddr, string name);

     event requestedJoinDao(address indexed multiSigAddr, address indexed yourAddr);

    function createDAO(string memory _daoName, string memory _location, string memory _targetAudience, string memory _daoTitle, string memory _daoDescription, string memory _daoOverview, string memory _daoImage, address _multisigAddr) public  onlyAdmin {
        daoName = _daoName;
        location = _location;
        targetAudience = _targetAudience;
        daoTitle = _daoTitle;
        daoDescription = _daoDescription;
        daoOverview = _daoOverview;
        daoImage = _daoImage;
        multiSigAddr = _multisigAddr;

        emit DAOCreated(multiSigAddr, daoName);
    }

    //in the backend, ensure that whoever calls this function is logged in to a specific dao, the contract will check if is admin
    function addMembers(uint  _phoneNo, string memory _memberName, string memory _idNo, string memory _email, address   _memberAddr, string memory _role) public onlyAdmin {
        phoneNo = _phoneNo;
        memberName = _memberName;
        idNo = _idNo;
        email = _email;
        memberAddr = _memberAddr;
        role = _role;
    }

    //use backend to ensure the dao address exists
    function requestToJoinDao(address _multiSigAddr, string memory _name, string memory _role, string memory _phoneNo, address yourAddr) public {

        emit requestedJoinDao(multiSigAddr, yourAddr);
    }

    //refactor to private
    function whiteListMember(address _memberAddr) public onlyAdmin{
      membersToAllow.push(_memberAddr);
    }
}
