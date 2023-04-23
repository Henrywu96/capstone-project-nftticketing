pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Base64.sol";

contract NFTtickets is ERC721URIStorage{

  // Using Counters to count the number of tickets
  using Counters for Counters.Counter;
  Counters.Counter private currID;

  mapping(address => uint256[]) public tokenID;

  bool public saleStatus = false;
  uint public totalTickets = 100;
  uint public numOfTickets = 100;
  // uint public mintPrice = 100000000000000000000;

  constructor() ERC721("NFTTicket", "NFTT") {
    currID.increment();
    console.log(currID.current());
  }

  function sale() public {
    saleStatus = true;
  }

  function closeSale() public {
    saleStatus = false;
  }

  // Minting
  function mint() public payable {
    // check if there's enough available tickets
    require(numOfTickets > 0, "Not enough tickets!");
    // require(msg.value >= mintPrice, "Not enough Eth!");
    require(saleStatus, "Tickets are not on sale!");
    string[3] memory svg;
    svg[0] = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text y="50">';
    svg[1] = Strings.toString(currID.current());
    svg[2] = '</text></svg>';

    // Concatenate the strings in this array into a single svg string
    string memory images = string(abi.encodePacked(svg[0], svg[1], svg[2]));
    bytes memory byt = bytes(images);
    // To persist the image on the blockchain, need to encoded base64
    string memory encodedImg = Base64.encode(string(byt));
    console.log(encodedImg);

    string memory json = Base64.encode(
        string(
          abi.encodePacked(
              '{ "name": "NFTTicket #',
              Strings.toString(currID.current()),
              '", "description": "A NFT-powered ticketing system", ',
              '"traits": [{ "trait_type": "Checked In", "value": "true" }, { "trait_type": "Purchased", "value": "true" }], ',
              '"images": "data:image/svg+xml;base64,', encodedImg, '" }' 
          )
        )
    );

    string memory tokenURI = string(abi.encodePacked(
      "data:application/json;base64,", json
    ));
    console.log(tokenURI);

    _safeMint(msg.sender, currID.current());
    _setTokenURI(currID.current(), tokenURI);

    currID.increment(); // increment current ID value
    numOfTickets -= 1;
  }

  function numOfTicketsCounts() public view returns (uint) {
    return numOfTickets;
  }

  function totalTicketsCounts() public view returns (uint) {
    return totalTickets;
  }

  function confirmOwnership(address addr) public view returns (bool) {
    return tokenID[addr].length > 0;
  }
  
}
