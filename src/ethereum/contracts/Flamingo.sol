pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;


contract FlamingoFactory{
    //Variables Declaration
    mapping(address =>  bool) public sources;
    mapping(address =>  bool) public deployedContracts;
    address public manager;
    
    //Modifiers Declaration
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    //Constructor
    constructor() public{
        manager = msg.sender;
    }

    //Events
    event ContractCreated(address contractAddress);
    
    //Functions Declaration
    function checkSource(address source) public view returns(bool){
        return sources[source];
    }
    
    function checkCertContract(address contractAddress) public view returns(bool){
        return deployedContracts[contractAddress];
    }
    
    function alterSources(address source, bool enabled) public restricted {
        sources[source] = enabled;
    }
    
    function createContract() public returns (address){
        address deployedContract = new FlamingoRecord(msg.sender, this);
        emit ContractCreated(deployedContract);
        deployedContracts[deployedContract] = true;
        return deployedContract;
    }
    
}


contract FlamingoRecord{
    //Structs Declaration
    struct Flamingo {
        string name;
        string imageUrl;
        address source;
    }
    
    //Variables Declaration
    Flamingo[] public flamingos;
    address public manager;
    FlamingoFactory public factory;
    
    //Modifiers Declaration
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    //Constructor
    constructor(address creator, address contractAddress) public {
        factory = FlamingoFactory(contractAddress);
        manager = creator;
    }
    
    //Functions Declaration
    function getflamingos() public view returns (Flamingo[]){
        return flamingos;
    }
    
    function getflamingosLength() public view returns(uint){
        return flamingos.length;
    }
    
    function addFlamingo(string name, string imageUrl) public restricted {
        Flamingo memory cert = Flamingo({
            name: name,
            imageUrl: imageUrl,
            source: msg.sender
        });
        flamingos.push(cert);
    }
}