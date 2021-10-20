const Market = artifacts.require("NFTMarket");
const Gamja = artifacts.require("Gamja");

module.exports = async function(deployer) {
  // Deploy gameItem
  await deployer.deploy(Gamja);
  const gamja = await Gamja.deployed();
  // Deploy market
  await deployer.deploy(Market, gamja.address);
  const market = await Market.deployed();

  await gamja.setApprovalForAll(market.address);
};
