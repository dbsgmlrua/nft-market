// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Gamja.sol";

contract NFTMarket {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;

  address payable owner;
  uint256 public listingPrice = 0.025 ether;
  Gamja public token; 

  constructor(Gamja _token) {
    token = _token;
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    uint256 tokenId;
    address payable owner;
    uint256 price;
    bool onSale;
  }
  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint indexed itemId,
    uint256 indexed tokenId,
    address owner,
    uint256 indexed price,
    bool onSale
  );

  function createItem(string memory uri, uint256 price) public payable {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    uint256 tokenId = token.mint(msg.sender, uri);

    idToMarketItem[itemId] = MarketItem(itemId, tokenId, payable(msg.sender), price, true);
    
    emit MarketItemCreated(itemId, tokenId, msg.sender, price, true);
  }
  function getItemList() public view returns(MarketItem[] memory){
    uint itemCount = _itemIds.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].onSale) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return items;
  }
  function getItemDetail(uint itemId) public view returns(MarketItem memory){
    return idToMarketItem[itemId];
  }
  function buyItem(uint itemId) public payable {
    MarketItem memory currentItem = idToMarketItem[itemId];
    require(msg.value == currentItem.price, "Price must be equal to listed price");
    uint256 royalty = (uint256(currentItem.price) * 250) / 10000;
    uint256 result = msg.value - royalty;

    payable(owner).transfer(royalty);
    payable(currentItem.owner).transfer(result);
  }
  function getTokenURI(uint itemId) public view returns(string memory){
    MarketItem memory currentItem = idToMarketItem[itemId];
    uint256 tokenId = currentItem.tokenId;
    return token.tokenURI(tokenId);
  }
}