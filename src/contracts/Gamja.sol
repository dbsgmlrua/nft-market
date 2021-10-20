pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Gamja is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenId;

  bool public onSale = true;
  uint public price;

    constructor() ERC721("Gamja", "GMJ"){

    }
    function mint(address _to, string memory _tokenURI)public returns(uint){
        tokenId.increment();
        uint256 _tokenId = tokenId.current();
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        return _tokenId;
    }
    // function getTokenURI(uint256 _tokenId) public view returns(string memory){
    //     return tokenURI(_tokenId);
    // }
    function setApprovalForAll(address contractAddress) public {
        setApprovalForAll(contractAddress, true);
    }
    function getTotalSupply() public view returns(uint256){
        uint256 _tokenId = tokenId.current();
        return _tokenId;
    }
}