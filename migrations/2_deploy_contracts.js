const GameItem = artifacts.require("GameItem");
const Market = artifacts.require("Market");

module.exports = async function(deployer) {
  // Deploy market
  await deployer.deploy(Market);
  const market = await Market.deployed()

  // Deploy gameItem
  await deployer.deploy(GameItem, market.address);
};
