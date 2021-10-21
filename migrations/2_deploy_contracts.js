const Market = artifacts.require("NFTMarket");
const Gamja = artifacts.require("Gamja");

module.exports = async function(deployer) {
  // Deploy market
  await deployer.deploy(Market);
  const market = await Market.deployed();
  // Deploy gameItem
  await deployer.deploy(Gamja, market.address);
  const gamja = await Gamja.deployed();
};
