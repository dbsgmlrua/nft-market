const Market = artifacts.require("NFTMarket");
const GameItem = artifacts.require("GameItem");

module.exports = async function(deployer) {
  // Deploy market
  await deployer.deploy(Market);
  const market = await Market.deployed()

  // Deploy gameItem
  await deployer.deploy(GameItem, market.address);
};
