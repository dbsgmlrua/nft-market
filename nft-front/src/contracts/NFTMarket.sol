// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;

  address payable owner;
  uint256 public listingPrice = 0.025 ether;

  constructor () {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    uint256 price;
    bool onSale;
  }
  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address owner,
    uint256 price,
    bool onSale
  );

  function createItem(address nftContract, uint256 tokenId, uint256 price) public payable {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] = MarketItem(itemId, nftContract, tokenId, price, true);
    
    payable(owner).transfer(listingPrice);
    emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, price, true);
  }
  function getItemList() public view returns(MarketItem[] memory){
    uint totalItemCount = _itemIds.current();
    uint currentIndex = 0;
    uint itemCount = 0;

    for(uint i =0; i< totalItemCount; i++){
      if(idToMarketItem[i + 1].onSale){
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].onSale) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return items;
  }
  function getMyItemList() public view returns(MarketItem[] memory){
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i =0; i< totalItemCount; i++){
      address itemOwner = IERC721(idToMarketItem[i + 1].nftContract).ownerOf(idToMarketItem[i + 1].tokenId);
      if(itemOwner == msg.sender){
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      uint currentId = i + 1;
      address itemOwner = IERC721(idToMarketItem[i + 1].nftContract).ownerOf(idToMarketItem[i + 1].tokenId);
      if (itemOwner == msg.sender) {
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
    // MarketItem memory currentItem = idToMarketItem[itemId];
    uint256 royalty = (uint256(idToMarketItem[itemId].price) * 250) / 10000;
    uint256 result = msg.value - royalty;
    address from = IERC721(idToMarketItem[itemId].nftContract).ownerOf(idToMarketItem[itemId].tokenId);
    require(msg.value == idToMarketItem[itemId].price, "Price must be equal to listed price");
    require(from != msg.sender, "Buyer must be not equal to Buyer");
    payable(from).transfer(result);

    IERC721(idToMarketItem[itemId].nftContract).transferFrom(from, msg.sender, idToMarketItem[itemId].tokenId);
    idToMarketItem[itemId].onSale = false;
    payable(owner).transfer(royalty);
  }
  function changeOnSaleStatus(uint itemId, bool _onSale) public {
    require(_onSale != idToMarketItem[itemId].onSale, "Status must be not equal changing status");
    idToMarketItem[itemId].onSale = _onSale;
  }
  function changeSalePrice(uint itemId, uint256 _price) public {
    require(_price > 0, "Price must be at least 1 wei");
    idToMarketItem[itemId].price = _price;
  }
}